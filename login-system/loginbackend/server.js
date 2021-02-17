const express = require('express') // express package
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session')
const dotenv = require('dotenv')
const routes = require('./routes/routes')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware');

const secret = "secret-key"; // secret key for decrypting passwords
const loginModel = require('../loginbackend/models/LoginModels');

mongoose.connect(process.env.DATABASE_ACCESS, () => console.log("Database Connected"))

dotenv.config() // using dot env package for safe security

const app = express(); // initilising express

app.use(bodyParser.json())  //parsing our incoming and outoing requests
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(cors()) // corse middle-ware


//app.set('trust proxy', 1) // trust first proxy
/*app.use(session({ // creating session which is available in the request objects in routes.
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
   
}))*/

app.use('/services', routes) // api is the base path. routes.js then handles the next pathing, such as post(/signup)

app.listen(4000, () => console.log("Server is up and running..")) // listening to port 4000
 // passing through user user obj, with "username" and "password" fields
 app.post('/signin', function (request, response) {
    // findOne is mongoose function, linked directly the loginModel import.
    //console.log(request.query)

    console.log(request.body);
    const username = request.body.params.username;
    const password = request.body.params.password;
    // FINDS USER WITH USERNAME. 
     loginModel.findOne({'username': username}, function (err, user){  
         if(err) {
             console.log(err);
             response.status(500).json({error: 'Interal Error bro'});
         } else if (!user) {
             response.status(401).json({error: 'incorrect email or password'});
         } else {
             user.isCorrectPassword(password, function(err, same) {
                 if (err) { response.status(500).json({error:'Internal Error bro'}); }
                 else if(!same) { response.status(401).json({error: 'incorrect email or password'}); }
                 else {
                     const payload = { user };
                     // creating a json token and passing user model as the payload
                     const token = jwt.sign(payload, secret, { 
                         expiresIn: '1h'
                     });
                    console.log(payload); // payload is correct data

                    response.cookie('authCookie', token, {maxAge:900000, httpOnly: false}); // creating token cookie

                    console.log(response); // logging response obj

                    response.send("You are logged in");
                 }
             })
         }
     })
     .catch(error => {

         console.log(error) // catch log error
     })       
 })

 
 app.get('/dashboard', withAuth, function(request, response) {      
    //console.log(request.signedCookies.token);
    //response.json(request.session);
}) 



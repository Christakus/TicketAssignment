    const express = require('express')
    const router = express.Router()
    const loginModel = require('../models/LoginModels')
    const bcrypt = require('bcrypt') // for password encryption
    const mongoose = require('mongoose')
    const session = require('express-session')
    const TicketModel = require('../models/TicketModel')
    const dotenv = require("dotenv");
    const jwt = require('jsonwebtoken');
    const withAuth = require('../middleware');


    // get config vars
    dotenv.config();

    const secret = process.env.SECRET;
    // when the user is on the /signup page, and they enter their data, they click button, which comes to this function.
    router.post('/signup', async (request, response) => {

        const signedUpUser = new loginModel({
            fullName: request.body.user.fullName, // in the request, the body is sent. The variables need to be bound on front-end
            username: request.body.user.username,
            email: request.body.user.email,
            password: request.body.user.password // passing encrypted password into database
        })
        console.log(signedUpUser);

        signedUpUser.save() // mongoose function. Save to the database.
        .then(data => { 
            response.json(data) 
        })
        .catch(error => {
            response.json(error) // catch error.
        })
    })

   

    router.post('/openticket', function(req, res) {
        console.log(req.body);
        
        const newTicket = new TicketModel({
            ticketSender: req.body.ticket.ticketSender,
            ticketTitle: req.body.ticket.ticketTitle,
            senderDepartment: req.body.ticket.senderDepartment,
            ticketBody: req.body.ticket.ticketBody,
            ticketStatus: req.body.ticket.ticketStatus
            
        })
        newTicket.save() // mongoose function. Save to the database.
        .then(data => { 
            res.json(data) 
        })
        .catch(error => {
            res.json(error) // catch error.
        })
    })

    router.get('/loadusertickets', function(req, res) {

        TicketModel.find({'ticketSender': req.query.username})  // FINDS ALL TICKETS WITH USERNAME.
        .then(data => { // data from database.
        res.json(data) // converting to json object
        })
        .catch(error => {

            console.log(error) // catch log error
        })       

    })
    


module.exports = router
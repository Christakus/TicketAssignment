const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const salt = 10; // salt rounds for hashing
const signUpModel = new mongoose.Schema({
        fullName:{ 
            type:String,
            //require:true

        },
        username:{
            type:String,
            require:true
        },
        email:{
            type:String,
            //required:true
        },
        password:{
            type:String,
            required:true
        },
        date:{
            type:Date, // this is triggered when acc is made. linking the date of creation to an account.
            default:Date.now
        }
});

signUpModel.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        }  else {
            callback(err, same);
        }
    });
}

// this mongoose function is called before the .save function is executed
signUpModel.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) { // if the password is new or modified
        const model = this; // storing the current model as local variable for access
        bcrypt.hash(this.password, salt, function(err, hashedPassword) { // hashing password using salt and temp variable
            if(err) {
                next(err); // continues the program and passes error
            } else {
                model.password = hashedPassword; // assigning value to current model with new hashed password
                next(); // continue
            }
             
        });
    } else {
        next(); // continue
    }
})

module.exports = mongoose.model('usertable', signUpModel)
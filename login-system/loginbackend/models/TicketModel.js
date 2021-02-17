const mongoose = require('mongoose')

const ticketModel = new mongoose.Schema({
    ticketSender:{ 
        type:String,
        require:true
    },
    ticketTitle:{
        type:String,
        require:true
    },
    senderDepartment:{
        type:String,
        required:true
    },
    ticketBody:{
        type:String,
        required:true
    },
    ticketStatus:{
        type:String,
        required:true
    },
    date:{
        type:Date, // this is triggered when acc is made. linking the date of creation to an account.
        default:Date.now
    }
})

module.exports = mongoose.model('tickettable', ticketModel)
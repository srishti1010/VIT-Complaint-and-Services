const mongoose = require('mongoose');
const passportlocalmongoose = require("passport-local-mongoose");
const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:true
    },
    password: {
        type: String
    },
    registrationNumber: {
        type: String,
        unique: true
    },
    complaint:[
     {
        type:mongoose.Schema.Types.ObjectId,
        ref:'complaint'
     }   
    ]

});
studentSchema.plugin(passportlocalmongoose);
// Model for Student
const Student = mongoose.model('Student', studentSchema);

module.exports =  Student ;
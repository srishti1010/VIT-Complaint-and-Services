const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/complaintwebdb");

// Schema for Admin
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
});

// Model for Admin
const Admin = mongoose.model('Admin', adminSchema);

module.exports =  Admin;

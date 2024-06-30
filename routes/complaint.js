const mongoose = require('mongoose');
const Student = require('./student');

// Schema for Complaint
const complaintSchema = new mongoose.Schema({
  Student :{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Student"
  },
    address: {
        type: String
    },
    name: {
        type: String
    },
    registrationnumber: {
        type: String
    },
    type: {
        type: String
    },
    mobilenumber: {
        type: Number
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'inprogress', 'completed'],
        default: 'pending'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
});

// Model for Complaint
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;

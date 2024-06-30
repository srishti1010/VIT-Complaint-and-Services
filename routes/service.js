const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    roomnumber: {
        type: String,
        
    },
    name: {
        type: String,
    
    },
    registrationnumber: {
        type: String,
        
    },
    mobilenumber: {
        type: Number,
        
    },
    type: {
        type: String,
        
    },
    availability: {
        type:String,
    
    }
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;

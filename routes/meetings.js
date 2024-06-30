const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;

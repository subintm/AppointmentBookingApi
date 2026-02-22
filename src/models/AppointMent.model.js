const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
     UserId : 
     {
        type: mongoose.Schema.Types.ObjectId
        }, 
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true
        
    }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);






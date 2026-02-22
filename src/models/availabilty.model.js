const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  workingDays: {
    type: [String],
    required: true
  },

  startTime: {
    type: String,
    required: true
  },
  
  endTime: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
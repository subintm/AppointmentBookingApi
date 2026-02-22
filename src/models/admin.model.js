const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: String
});

module.exports = mongoose.model('AdminUser', adminSchema, 'AdminUsers');
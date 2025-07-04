const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },

  department: { type: String }, 
  location: { type: String }     
});

module.exports = mongoose.model('User', UserSchema);

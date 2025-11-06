// models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// This "pre-save hook" runs *before* an admin is saved to the DB
AdminSchema.pre('save', async function(next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // "Salt" the password (adds random characters) to make it more secure
  const salt = await bcrypt.genSalt(10);
  // Hash the password and store it
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);
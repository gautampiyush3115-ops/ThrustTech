// models/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
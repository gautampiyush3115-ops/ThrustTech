// routes/contact.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import our new model

// @route   POST /api/contact
// @desc    Save a new message from the contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    // req.body contains the JSON data sent from the frontend
    const { name, email, subject, message } = req.body;

    // Create a new message instance using our model
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    // Save it to the database
    await newMessage.save();

    // Send a success response back to the frontend
    res.status(201).json({ msg: 'Message received! We will be in touch soon.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
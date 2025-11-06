// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// @route   POST /api/auth/login
// @desc    Log in an admin and get a token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if admin user exists
    let admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the plain-text password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If credentials are correct, create the JWT payload
    const payload = {
      admin: {
        id: admin.id // This is all we need to identify the user
      }
    };

    // 4. Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env
      { expiresIn: '5h' },    // Token is good for 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });  // Send the token back to the admin panel
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
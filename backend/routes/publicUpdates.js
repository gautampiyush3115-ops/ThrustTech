// routes/publicUpdates.js

const express = require('express');
const router = express.Router();
const Update = require('../models/Update');

// @route   GET /api/updates
// @desc    Get all updates, sorted by newest first
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all updates and sort them: -1 means descending order (newest first)
    const updates = await Update.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
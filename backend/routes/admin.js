// routes/admin.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Import our middleware

// Import the models we need to manage
const Message = require('../models/Message');
const Update = require('../models/Update');

// --- All routes in this file are prefixed with /api/admin and are protected ---

// === Message Routes ===

// @route   GET /api/admin/messages
// @desc    Get all contact messages
// @access  Private
router.get('/messages', auth, async (req, res) => {
  // 'auth' runs first. If the token is valid, this async function runs.
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// === Update (CMS) Routes ===

// @route   POST /api/admin/updates
// @desc    Create a new website update
// @access  Private
router.post('/updates', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newUpdate = new Update({
      title,
      content,
      // We can get the admin ID from the middleware!
      // author: req.admin.id 
    });

    const update = await newUpdate.save();
    res.json(update);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/updates/:id
// @desc    Delete an update
// @access  Private
router.delete('/updates/:id', auth, async (req, res) => {
  try {
    let update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ msg: 'Update not found' });
    }

    await Update.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Update removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
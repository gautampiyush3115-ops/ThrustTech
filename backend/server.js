// server.js

require('dotenv').config(); // Loads .env variables into process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
app.use(cors());          // Allows requests from other origins (your frontend)
app.use(express.json());  // Parses incoming JSON request bodies

// --- 2. Database Connection ---
// server.js (NEW)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- 3. API Routes ---
// We will add these one by one
app.get('/api', (req, res) => {
  res.send('Aerospace Backend API is running!');
});

// --- 4. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// server.js (in section 3)
// --- 3. API Routes ---

// A test route just to make sure the server is alive
app.get('/api', (req, res) => {
  res.send('Aerospace Backend API is running!');
});

// For the public contact form
app.use('/api/contact', require('./routes/contact.js'));

// For the public updates/news page
app.use('/api/updates', require('./routes/publicUpdates.js'));

// For the admin login page
app.use('/api/auth', require('./routes/auth.js'));

// For the protected admin dashboard
app.use('/api/admin', require('./routes/admin.js'));
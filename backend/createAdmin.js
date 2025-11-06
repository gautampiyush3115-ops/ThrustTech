// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/admin'); // Adjust path if your model is elsewhere

// --- CONFIGURE YOUR ADMIN USER HERE ---
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "divyanshhii123"; // Choose a real password
// ----------------------------------------

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin creation...');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      mongoose.connection.close();
      return;
    }

    // Create new admin
    const newAdmin = new Admin({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD
    });

    await newAdmin.save(); // The 'pre-save' hook in your model will hash the password
    console.log(`SUCCESS: Admin user '${ADMIN_USERNAME}' created.`);

    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    mongoose.connection.close();
  }
};

dbConnect();
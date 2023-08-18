const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Admin schema
const adminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create an Admin model
const Admin = mongoose.model("Admin", adminSchema);

// Generate a salt for password hashing
const salt = await bcrypt.genSalt(10);

// Hash the admin password
const hashedPassword = await bcrypt.hash("admin_password", salt);

// Create a new admin user document
const admin = new Admin({
  username: "admin",
  email: "admin@example.com",
  password: hashedPassword,
});

// Save the admin user document to the database
await admin.save();

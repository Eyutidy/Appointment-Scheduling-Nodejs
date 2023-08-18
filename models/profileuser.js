const mongoose = require("mongoose");

// Define the schema for the data
const formSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  email: { type: String, required: true },
});

// Create a model for the data using the schema
const Form = mongoose.model("Profileuser", formSchema);

module.exports = Profileuser;

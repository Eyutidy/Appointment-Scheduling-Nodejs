const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  time: {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
});

module.exports = mongoose.model("Availability", availabilitySchema);

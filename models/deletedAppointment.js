const mongoose = require("mongoose");

const deletedAppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const DeletedAppointment = mongoose.model(
  "DeletedAppointment",
  deletedAppointmentSchema
);

module.exports = DeletedAppointment;

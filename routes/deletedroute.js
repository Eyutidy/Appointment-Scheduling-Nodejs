const express = require("express");
const Appointment = require("../models/appointment");
const DeletedAppointment = require("../models/deletedAppointment");
const router = express.Router();

// Delete appointment and move it to deleted appointments collection
router.delete("/DeletedAppointment/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Deleting appointment with id", id);
  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    const deletedAppointment = new DeletedAppointment({
      name: appointment.name,
      date: appointment.date,
      time: appointment.time,
    });

    await deletedAppointment.save();

    res.send("Appointment deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;

// Import required modules
const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

// Get an appointment by ID
router.get("/get_appointment/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.json(appointment);
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ message: "Failed to retrieve appointment" });
  }
});

// Reschedule an appointment by ID
router.put("/reschedule_appointment/:id", async (req, res) => {
  try {
    const { date, time } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time },
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Failed to reschedule appointment" });
  }
});

module.exports = router;

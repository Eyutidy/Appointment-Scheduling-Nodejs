const express = require("express");
const router = express.Router();
const User = require("../models/User");
const DeletedAppointment = require("../models/deletedAppointment");

router.delete("/users/:id", async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.json({ success: false });
  }
});

app.delete("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    res.send("Appointment deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.delete("/appointments/:id", async (req, res) => {
  try {
    const result = await Appointment.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Failed to delete appointment:", err);
    res.json({ success: false });
  }
});

module.exports = router;

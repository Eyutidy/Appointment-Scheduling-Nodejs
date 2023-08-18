const express = require("express");
const Appointment = require("../models/appointment"); // Import the Mongoose model for Appointment
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret =
  "13657168cdf62fed5891478f2024ce1f9a8554c6cb8509df6800dc7ec9bdb868";
const Availability = require("../models/availabilityModel");
const sendEmail = require("./email");
// Route for handling form submission
router.post("/submit_appointment", async (req, res) => {
  try {
    // Extract form data from request body
    const { email, date, time } = req.body;

    // Find the user in the database using their email
    const user = await User.findOne({ email });

    // Check the number of appointments for the given date and time
    const appointmentCount = await Appointment.countDocuments({
      date,
      time,
    });

    // Set the maximum allowed appointments for a given date and time
    const maxAppointments = 3;

    if (appointmentCount >= maxAppointments) {
      const token = jwt.sign({ email: user.email }, secret);

      return res
        .status(400)
        .send(
          `<script>alert("Appointment time is fully booked please choose another time or date!!"); window.location.href="addapp?token=${token}";</script>`
        );
    }

    // Check if the time is already booked in the Availability table
    const isTimeAppointed = await Availability.findOne({
      "time.date": date,
      "time.time": time,
      requestId: user.id,
    });

    if (!isTimeAppointed) {
      const appointment = new Appointment({
        name: user.name,
        email,
        date,
        time,
        userId: user.id,
      });

      // Save the appointment to the database
      await appointment.save();

      const availability = new Availability({
        time: {
          date,
          time,
        },
        requestId: user.id,
      });

      await availability.save();

      await sendEmail(user.name, email, date, time);

      const token = jwt.sign({ email: user.email }, secret);

      // Return success response
      return res
        .status(201)
        .send(
          `<script>alert("Appointment booked successfully"); window.location.href="Userd?token=${token}";</script>`
        );
    } else {
      const token = jwt.sign({ email: user.email }, secret);

      return res
        .status(400)
        .send(
          `<script>alert("Appointment time is taken"); window.location.href="addapp?token=${token}";</script>`
        );
    }
  } catch (err) {
    // Handle validation errors or any other errors
    console.error("Error saving appointment to database:", err);
    return res.status(500).json({ message: "Failed to book appointment" });
  }
});

router.delete("/delete_appointment/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the appointment to be deleted
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { date, time } = appointment;

    // Delete the appointment
    await appointment.deleteOne();

    // Delete the corresponding availability
    await Availability.findOneAndDelete({
      "time.date": date,
      "time.time": time,
    });

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return res.status(500).json({ message: "Failed to delete appointment" });
  }
});

// Route for rescheduling an appointment
router.post("/reschedule_appointment", async (req, res) => {
  try {
    const { userId, date, time } = req.body; // Extract new date and time from request body
    console.log("userId:", userId);
    // console.log(date);
    // console.log(time);
    const appointment = await Appointment.findOne({ userId: userId }); //// Find the appointment to be rescheduled
    console.log("appointment:", appointment);

    const isTimeAppointed = await Availability.findOneAndDelete({
      "time.date": date,
      "time.time": time,
      requestId: appointment.userId,
    });

    if (!isTimeAppointed) {
      const oldAvailability = await Availability.findOneAndDelete({
        "time.date": appointment.date,
        "time.time": appointment.time,
        requestId: appointment.userId,
      });

      appointment.date = date; // Update the appointment's date
      appointment.time = time; // Update the appointment's time

      await appointment.save();

      const availability = new Availability({
        time: {
          date,
          time,
        },
        requestId: appointment.userId,
      });

      await availability.save();

      res.status(200).json({ message: "Appointment rescheduled successfully" });
    } else {
      res.status(400).json({ message: "Appointment time is taken" });
    }
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Failed to reschedule appointment" });
  }
});

router.post("/appointmentTime", async (req, res) => {});

module.exports = router;

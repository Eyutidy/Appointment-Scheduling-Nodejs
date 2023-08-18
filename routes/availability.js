  const express = require("express");
  const router = express.Router();
  const Availability = require("../models/availability");

  router.post("/sample-route", async (req, res) => {
    try {
      const { date } = req.body;

      console.log(req.body)

      res.render("Hello")

      

  /*     const times = [
        { start: "9:00 AM", end: "10:00 AM", selected: false },
        { start: "10:00 AM", end: "11:00 AM", selected: false },
        { start: "11:00 AM", end: "12:00 PM", selected: false },
        { start: "12:00 PM", end: "1:00 PM", selected: false },
        { start: "1:00 PM", end: "2:00 PM", selected: false },
        { start: "2:00 PM", end: "3:00 PM", selected: false },
        { start: "3:00 PM", end: "4:00 PM", selected: false },
      ];

      const availability = new Availability({
        date: date,
        times: times,
      });

      await availability.save();

      return res.status(200).send(`Availability set successfully for ${date}.`);
    } catch (error) {
      console.error("Error while setting availability:", error);
      return res.status(500).send("Error while setting availability.");
    } */
  });

  module.exports = router;

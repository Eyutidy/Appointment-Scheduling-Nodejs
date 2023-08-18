const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");

router.post("/register", adController.register);

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

module.exports = router;

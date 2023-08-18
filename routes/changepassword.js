const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/change-password", async (req, res) => {
  const { password, newpassword, renewpassword } = req.body;

  // check if new password and re-entered password match
  if (newpassword !== renewpassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  // find the user by their ID
  const user = await User.findById(req.user._id);

  // check if current password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  // update the user's password
  user.password = newpassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;

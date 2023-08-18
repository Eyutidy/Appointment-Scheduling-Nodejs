const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey =
  "13657168cdf62fed5891478f2024ce1f9a8554c6cb8509df6800dc7ec9bdb868";
const User = require("../models/User");
const SystemPref = require("../models/systemPref");

const signup = async (req, res) => {
  const { name, email, username, password, confirmPassword } = req.body;
  console.log(req.body);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .send(
          `<script>alert("Username already exists"); window.location.href="/signup";</script>`
        );
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send(
          `<script>alert("Password doesn't match"); window.location.href="/signup";</script>`
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user document
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      status: "1",
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    // Generate a JWT token for the new user
    const token = jwt.sign({ id: savedUser._id }, secretKey);
    res.cookie("jwt", token, { httpOnly: true });
    // Redirect the user to their dashboard
    res.redirect(`/signin?token=${token}`);
  } catch (err) {
    // Handle any errors

    res.status(400).json({ err });
  }
};

const signin = async (req, res) => {
  session = req.session;
  const { username, password } = req.body;
  console.log(req.body);

  try {
    // Check if the user is an admin
    if (username === "admin" && password === "adminadmin") {
      //set default availability time

      // const date = new Date();
      // const dateOnly = date.toLocaleDateString();
      // console.log(dateOnly);
      const token = jwt.sign({ id: "admin", isAdmin: true }, secretKey);
      res.cookie("jwt", token, { httpOnly: true });
      console.log(token);
      res.redirect(`/admin?token=${token}`);
      return;
    }
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res
        .status(401)
        .send(
          `<script>alert("Invalid credentials"); window.location.href="/signin";</script>`
        );
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .send(
          `<script>alert("Invalid credentials"); window.location.href="/signin";</script>`
        );
    }

    if (existingUser.status === "0") {
      return res
        .status(401)
        .send(
          `<script>alert("You are deactivated"); window.location.href="/signin";</script>`
        );
    }
    // Generate a JWT token for the user
    const token = jwt.sign({ id: existingUser._id, isAdmin: false }, secretKey);
    res.cookie("jwt", token, { httpOnly: true });
    // Redirect the user to their dashboard
    res.redirect(`/Userd?token=${token}`);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res
      .status(500)
      .send(
        `<script>alert("Server error !!!"); window.location.href="/signin";</script>`
      );
  }
};

module.exports = {
  signup,
  signin,
};

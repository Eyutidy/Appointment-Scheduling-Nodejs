const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const secretKey =
  "13657168cdf62fed5891478f2024ce1f9a8554c6cb8509df6800dc7ec9bdb868";
const susi = require("./routes/susi");
const Appointment = require("./models/appointment");
const adap = require("./routes/adap");
const deletedroute = require("./routes/deletedroute");
const DeletedAppointment = require("./models/deletedAppointment");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");
const sendEmaildel = require("./routes/emaildelete");
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "13657168cdf62fed5891478f2024ce1f9a8554c6cb8509df6800dc7ec9bdb868",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(susi);
app.use(adap);
app.use(deletedroute);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
const mongoose = require("mongoose");
const Availability = require("./models/availabilityModel");
mongoose
  .connect("mongodb://localhost:27017/?directConnection=true", options, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use((req, res, next) => {
  if (!req.user) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  }
  next();
});

const verifyToken = (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res
      .status(401)
      .send(
        `<script>alert("Unauthorized"); window.location.href="/signin";</script>`
      );
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.userId = decodedToken.id;
    next();
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .send(
        `<script>alert("Invalid credentials"); window.location.href="/signin";</script>`
      );
  }
};

// isAdmin middleware to check if user is an admin
const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = null;
        if (decodedToken.isAdmin) {
          user = { _id: decodedToken.id, username: "admin", isAdmin: true };
        } else {
          user = await User.findById(decodedToken.id);
        }
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

app.get("*", checkUser);
// protected route that requires isAdmin middleware

app.get("/admin", verifyToken, checkUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.render("./admin/Admin.ejs", { appointments, token: req.query.token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/", (req, res) => {
  res.render("Home.ejs");
});

app.get("/profile", verifyToken, checkUser, async (req, res) => {
  res.render("./admin/ProfileA.ejs", { token: req.query.token });
});
// Protected routes
app.get("/profileu", checkUser, async (req, res) => {
  res.render("./user/Profileuser.ejs", { token: req.query.token });
});

app.get("/Userd", verifyToken, checkUser, async (req, res) => {
  try {
    // Retrieve all appointments from the database
    const appointments = await Appointment.find({});

    // Render the Userd view and pass the appointments data to it
    res.render("./user/Userd.ejs", {
      appointments,
      token: req.query.token,
    });
  } catch (err) {
    console.error("Error retrieving appointments from database:", err);
    res.status(500).json({ message: "Failed to retrieve appointments" });
  }
});

app.get("/addapp", checkUser, async (req, res) => {
  try {
    const user = res.locals.user ? res.locals.user : {};
    const userData = await User.findOne({ _id: user._id }).exec();

    if (!userData) {
      throw new Error("User not found");
    }
    res.render("./user/Addapp.ejs", {
      token: req.query.token,
      user,
      name: userData.name,
      email: userData.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//signout
app.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/signin");
});

//manage user Admin
app.get("/manageUser", verifyToken, async (req, res) => {
  const users = await User.find({ status: "1" }); // retrieve user data from database
  res.render("./admin/manageUser.ejs", {
    token: req.query.token,
    Users: users,
  });
  console.log(users);
});

//Admin delete/cancel database from the appointment
app.get("/canceled", verifyToken, async (req, res) => {
  try {
    const deletedAppointments = await DeletedAppointment.find();
    res.render("./admin/canceled.ejs", {
      token: req.query.token,
      deletedAppointments: deletedAppointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/settingAvailability", verifyToken, async (req, res) => {
  res.render("./admin/availability.ejs", { token: req.query.token });
});

app.get("/rescheduledA", verifyToken, async (req, res) => {
  res.render("./admin/rescheduled.ejs", { token: req.query.token });
});

app.get("/rescheduled", verifyToken, async (req, res) => {
  res.render("./user/reschedule.ejs", { token: req.query.token });
});

//delete user from database Admin
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "0" });
    user.status = "0";
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deactivated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// app.delete("/appointments/:id", async (req, res) => {
//   try {
//     const appointment = await Appointment.deleteOne({ _id: req.params.id });
//     if (appointment.deletedCount === 0) {
//       return res.status(404).send("Appointment not found");
//     }
//     res.send("Appointment deleted successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

app.delete("/appointments/:userId", async (req, res) => {
  const { userId } = req.params;
  const { date, time } = req.query;
  try {
    const deletedAppointments = await Appointment.deleteOne({
      userId: req.params.userId,
    });
    const availlability = await Availability.deleteOne({ requestId: userId });
    console.log(availlability);
    if (deletedAppointments.deletedCount === 0) {
      return res.status(404).send("No appointments found for the user");
    }
    // if (deletedAvailability.deletedCount === 0) {
    //   return res.status(404).send("No availabilities found for the user");
    // }
    const user = await User.findById(userId);
    // const ap = await Appointment.findById(userId);
    try {
      await sendEmaildel(user.name, user.email, date, time);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    res.send("Appointments deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/reschedule", async (req, res) => {
  try {
    const userId = req.query.userId;
    const token = req.query.token;
    console.log(userId);
    // Retrieve the appointment details using the userId
    const appointment = await Appointment.findById(userId);

    // Render the reschedule.ejs page with the appointment details
    res.render("./user/reschedule.ejs", { userId, token, appointment });
  } catch (error) {
    console.error("Error retrieving appointment for rescheduling:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve appointment for rescheduling" });
  }
});

app.delete("/appointmentsA/:userId", async (req, res) => {
  const { userId } = req.params;
  const { date, time } = req.query;
  try {
    const deletedAppointment = await DeletedAppointment.findByIdAndDelete(
      userId
    );
    const user = await User.findById(userId);
    await sendEmaildel(user.name, user.email, date, time);
    if (!deletedAppointment) {
      return res.status(404).send("Deleted appointment not found");
    }
    res.send("Deleted appointment deleted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/changepassword", checkUser, async (req, res) => {
  const { currentPassword, newPassword, renewPassword, userId } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(userId[1]);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify the current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== renewPassword) {
      return res.status(402).json({ error: "Passwords don't match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    res.status(500).json({ error: "Server error occurred." });
  }
});

app.post("/update", checkUser, async (req, res) => {
  // Retrieve the form data from the request body
  const { userId, name, email } = req.body;
  console.log(userId);
  console.log(name);
  console.log(email);
  try {
    console.log("ID:", userId);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email },
      { new: true }
    );
    console.log("Updated User:", user);

    // Find the user by their ID and update the name and email

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Redirect to the same page with an alert message
    const token = req.cookies.jwt;
    res.send(
      `<script>alert('Successfully updated'); window.location.href = '/profileu?token=${token}';</script>`
    );
  } catch (error) {
    console.error("Error occurred while updating user:", error);
    // Redirect to an error page or send an error message
  }
});

// set availablity

app.post("/sample-route", verifyToken, async (req, res) => {
  const { date } = req.body;

  console.log(req.query.token);
  console.log(req.body);

  const setAvailability = await Availability.updateOne(
    {},
    {
      $push: {
        time: {
          start: req.body.startTime,
          end: req.body.endTime,
        },
      },
    },
    {
      new: true,
    }
  );

  /*  res.send(
    `<script>alert('Successfully updated'); window.location.href = /settingAvailability?token=${req.query.token}';</script>`
  ); */
  res.redirect(`/settingAvailability?token=${req.query.token}`);
});

app.use(express.static("public"));
app.use((req, res) => {
  res.render("404.ejs");
});

app.listen(4000);

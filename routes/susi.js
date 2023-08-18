const express = require("express");
const router = express.Router();
const susiController = require("../controllers/susiController");
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

router.post("/signup", susiController.signup);

router.post("/signin", susiController.signin);

router.get("/signin", (req, res) => {
  res.render("signin.ejs");
});
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
/* 
router.get("/changepassword", susiController.updatePassword); */

module.exports = router;

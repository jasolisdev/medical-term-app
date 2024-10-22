const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("./models/Users");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// // Serve static files from the build folder
// app.use("/medical-term-app", express.static(path.join(__dirname, "../build")));
//
// // Serve index.html for all requests to support client-side routing
// app.get("/medical-term-app/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build", "index.html"));
// });

app.get("/", (req, res) => {
  res.send("Welcome to the Medical Term App API");
});

// Registration Endpoint
app.post(
  "/api/register",
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a valid username"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("pin")
      .isLength({ min: 4, max: 4 })
      .withMessage("PIN must be exactly 4 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, pin } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create new user
      user = new User({
        username,
        email,
        password,
        pin,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Hash PIN
      user.pin = await bcrypt.hash(pin, salt);

      await user.save();

      // Generate JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("JWT generation error:", err);
            return res.status(500).send("Server error");
          }
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

// Login Endpoint
app.post(
  "/api/login",
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a valid username"),
    body("password").optional(),
    body("pin").optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, pin } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // If password is provided
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
        }
      } else if (pin) {
        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
        }
      } else {
        return res.status(400).json({ msg: "Password or PIN required" });
      }

      // Generate JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("JWT generation error:", err);
            return res.status(500).send("Server error");
          }
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

// Token Validation Endpoint
app.post("/api/validate-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, error: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true });
  } catch (error) {
    return res.json({ valid: false });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

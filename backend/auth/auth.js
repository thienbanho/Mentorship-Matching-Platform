const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");  // Import model thay vì define

const saltRounds = 10;
const sessions = {};

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const sessionId = Math.random().toString(36).substring(2);
    sessions[sessionId] = user.id;

    res.status(200).json({ message: "Login successful.", sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/logout", (req, res) => {
  const { sessionId } = req.body;

  if (sessions[sessionId]) {
    delete sessions[sessionId];
    res.status(200).json({ message: "Logged out successfully." });
  } else {
    res.status(400).json({ message: "Invalid session." });
  }
});

module.exports = router;


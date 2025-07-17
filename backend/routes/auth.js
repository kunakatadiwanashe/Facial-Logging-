
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, studentId, faceDescriptor } = req.body;
     console.log("Received registration:", { name, email, studentId });
  try {
    const user = new User({ name, email, studentId, faceDescriptor });
 
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

module.exports = router;
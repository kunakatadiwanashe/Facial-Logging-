const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");

function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + (val - arr2[i]) ** 2, 0));
}

router.post("/scan", async (req, res) => {
  const { faceDescriptor } = req.body;
  try {
    const users = await User.find();
    let matchedUser = null;
    let minDistance = Infinity;

    for (let user of users) {
      const dist = euclideanDistance(faceDescriptor, user.faceDescriptor);
      if (dist < 0.6 && dist < minDistance) {
        matchedUser = user;
        minDistance = dist;
      }
    }

    if (matchedUser) {
      const attendance = new Attendance({ userId: matchedUser._id });
      await attendance.save();
      res.json({ message: `Attendance logged for ${matchedUser.name}` });
    } else {
      res.json({ message: "Face not recognized" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error scanning face" });
  }
});



router.get("/logs", async (req, res) => {
  try {
    const logs = await Attendance.find().sort({ timestamp: -1 }).populate("userId");
    const result = logs.map((log) => ({
      user: {
        name: log.userId.name,
        email: log.userId.email,
        studentId: log.userId.studentId,
      },
      timestamp: log.timestamp,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving logs" });
  }
});












module.exports = router;

const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "Present" },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect("mongodb+srv://kunakatadiwanashe99:Bidnock66@cluster0.orvqs.mongodb.net/bookingandlogin?retryWrites=true&w=majority&appName=Cluster0/loggingin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
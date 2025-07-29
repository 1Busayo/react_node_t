// routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const UserLog = require("../models/UserLog"); 
const { adminOnly } = require("../middleware/authMiddleware");


router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET / get all logs
router.get("/logs",adminOnly, async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ loginTime: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
});


// DELETE /logs/:id — delete a specific log
router.delete("/logs/:id", adminOnly , async (req, res) => {
  try {
    const { id } = req.params;
    await UserLog.findByIdAndDelete(id);
    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log" });
  }
});


module.exports = router;
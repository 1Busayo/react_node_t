// routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const UserLog = require("../models/UserLog"); 
const { adminOnly } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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

// POST /admin/login — admin-only login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Ensure admin role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Admin login successful", token, role: user.role });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
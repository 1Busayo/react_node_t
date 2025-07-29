const User = require("../models/User"); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

// General Authentication Middleware
const protect = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Admin Authorization Middleware
const adminOnly = async(req, res, next) => {

      try {
         const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
  }
};



module.exports = { protect, adminOnly };
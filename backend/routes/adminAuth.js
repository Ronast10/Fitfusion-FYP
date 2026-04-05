import express from "express";
import User from "../models/User.js"; 
import Message from "../models/Message.js"; // 1. Import the Message model

const router = express.Router();

// NEW: Route to get all messages for the Admin Dashboard
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// NEW: Route for Dashboard Stats (Revenue, Users, etc.)
router.get("/dashboard-stats", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    
    // Sum up totalPaid field from all users for revenue
    const totalRevenue = users.reduce((acc, user) => acc + (user.totalPaid || 0), 0);
    
    res.json({
      success: true,
      totalUsers: users.length,
      totalRevenue: totalRevenue,
      inventoryValue: 0, // Placeholder
      members: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Your existing Login/Register code below ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email, role: "admin" });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin account not found" });
    }

    if (password === admin.password) {
      res.status(200).json({ 
        success: true, 
        message: "Login successful",
        admin: { email: admin.email } 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin ID already exists" });
    }

    const newAdmin = new User({
      email,
      password, 
      role: "admin"
    });

    await newAdmin.save();
    res.status(201).json({ success: true, message: "New admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

export default router;
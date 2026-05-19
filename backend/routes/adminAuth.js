import express from "express";
import User from "../models/User.js"; 
import Message from "../models/Message.js"; 

const router = express.Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/dashboard-stats", async (req, res) => {
  try {
    // 1. Fetch all non-admin users
    const users = await User.find({ role: { $ne: "admin" } });
    
    // 2. Calculate Gym Membership Revenue based on nested membershipStatus
    const totalRevenue = users.reduce((acc, user) => {
      const status = user.membershipData?.membershipStatus; 
      if (status === "Pro Member") return acc + 4000;
      if (status === "Elite Member") return acc + 7000;
      return acc;
    }, 0);
    
    // 🛒 3. CALCULATE SHOP REVENUE FROM NESTED USER PURCHASES
    let totalShopRevenue = 0;
    
    users.forEach((user) => {
      if (user.purchasedItems && user.purchasedItems.length > 0) {
        user.purchasedItems.forEach((item) => {
          const itemPrice = Number(item.price) || 0;
          const itemQuantity = Number(item.quantity) || 1; // Fallbacks safely to 1 if quantity isn't captured
          totalShopRevenue += itemPrice * itemQuantity;
        });
      }
    });
    
    // 4. Send clean payload back to the Admin Dashboard
    res.json({
      success: true,
      totalUsers: users.length,
      totalRevenue: totalRevenue,      // Gym Memberships Total Revenue (e.g., Rs. 11000)
      shopRevenue: totalShopRevenue,   // 💡 Dynamic total tracking from items bought!
      members: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
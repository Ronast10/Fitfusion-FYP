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
    
    // 2. Calculate Gym Membership Revenue
    const totalRevenue = users.reduce((acc, user) => {
      const status = user.membershipData?.membershipStatus; 
      if (status === "Pro Member") return acc + 4000;
      if (status === "Elite Member") return acc + 7000;
      return acc;
    }, 0);
    
    // 3. Calculate Shop Revenue
    let totalShopRevenue = 0;
    users.forEach((user) => {
      if (user.purchasedItems && user.purchasedItems.length > 0) {
        user.purchasedItems.forEach((item) => {
          const itemPrice = Number(item.price) || 0;
          const itemQuantity = Number(item.quantity) || 1;
          totalShopRevenue += itemPrice * itemQuantity;
        });
      }
    });
    
    // 4. Send clean payload
    res.json({
      success: true,
      totalUsers: users.length,
      totalRevenue: totalRevenue,
      shopRevenue: totalShopRevenue,
      members: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// FIXED: This route is now correctly placed outside of dashboard-stats
router.get("/all-purchases", async (req, res) => {
  try {
    const users = await User.find({ "purchasedItems.0": { $exists: true } });
    const allPurchases = [];

    users.forEach((user) => {
      user.purchasedItems.forEach((item) => {
        allPurchases.push({
          buyerName: user.name,
          buyerEmail: user.email,
          itemName: item.name,
          itemPrice: item.price,
          purchaseDate: item.purchaseDate || new Date(),
        });
      });
    });

    // Sort by date newest first
    allPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    
    res.json({ success: true, purchases: allPurchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) return res.status(401).json({ success: false, message: "Admin account not found" });

    // Enforce verification
    if (!admin.isVerified) return res.status(403).json({ success: false, message: "Please verify your email first." });

    if (password === admin.password) {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: "Email already registered" });

    const newAdmin = new User({ email, password, role: "admin", isVerified: false });
    await newAdmin.save();
    
    // Trigger your email verification logic here...
    res.status(201).json({ success: true, message: "Admin created. Please verify email." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
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
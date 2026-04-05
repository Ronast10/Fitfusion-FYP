import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// @route    GET /api/admin/dashboard-stats
router.get("/dashboard-stats", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const products = await Product.find({});

    // FIXED REVENUE LOGIC: Matches your MongoDB top-level field
    const totalRevenue = users.reduce((acc, user) => {
      const status = (user.membershipStatus || "").toLowerCase().trim();
      
      if (status.includes("pro")) return acc + 4000;
      if (status.includes("elite")) return acc + 7000;
      
      return acc;
    }, 0);

    // INVENTORY LOGIC: Sums up all product prices
    const inventoryValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      totalRevenue,
      inventoryValue,
      members: users, 
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching dashboard data" });
  }
});

// @route    DELETE /api/admin/user/:id
router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Member successfully removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete member" });
  }
});

export default router;
import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { adminID, password } = req.body;
    
    const admin = await Admin.findOne({ adminID });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized Admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong credentials" });
    }

    res.status(200).json({ 
      success: true, 
      token: "secure-admin-session-key" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
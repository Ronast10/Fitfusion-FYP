import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default avatar is set to avg1.png during registration
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      avatar: "avg1.png" 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Success - Returning avatar so frontend can save it to localStorage
    res.status(200).json({ 
      message: "Login successful",
      user: { 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar // Crucial for persistence on login
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE ROUTE (New)
// This is the route called by your Profile.jsx 'updateBackendProfile' function
router.put("/update-profile", async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, avatar },
      { new: true } // Return the updated document instead of the old one
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: { 
        name: updatedUser.name, 
        email: updatedUser.email, 
        avatar: updatedUser.avatar 
      }
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

export default router;
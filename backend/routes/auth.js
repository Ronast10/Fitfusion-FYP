import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// 1. GET USER DATA
// This is working, but ensure your User model includes 'streak' and 'lastLoggedDate'
router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user" });
  }
});

// 2. REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      avatar: "avg1.png",
      streak: 0, // Initialize progress
      lastLoggedDate: "" 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ 
      message: "Login successful",
      user: { 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar,
        streak: user.streak // Ensure streak is sent on login
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. UPDATE PROFILE ROUTE (FIXED)
// Previously, this was only saving name and avatar. 
// Now it saves streak and date so they don't reset on refresh
router.put("/update-profile", async (req, res) => {
  try {
    const { email, name, avatar, streak, lastLoggedDate } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          name, 
          avatar, 
          streak, 
          lastLoggedDate 
        } 
      },
      { new: true } // Returns the updated document from MongoDB
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true, // Frontend checks for this to sync state
      message: "Profile updated successfully",
      user: { 
        name: updatedUser.name, 
        email: updatedUser.email, 
        avatar: updatedUser.avatar,
        streak: updatedUser.streak,
        lastLoggedDate: updatedUser.lastLoggedDate
      }
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// 5. ESEWA PAYMENT VERIFICATION & MEMBERSHIP UPDATE
router.post("/verify-membership", async (req, res) => {
  try {
    const { email, amount } = req.body;

    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Determine Plan and Duration
    let months = 0;
    let status = "Free Member";

    if (amount === 4000) {
      status = "Pro Member";
      months = 3;
    } else if (amount === 8000) {
      status = "Elite Member";
      months = 6;
    }

    // 3. Calculate Expiry Date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // 4. Update Database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          membershipStatus: status,
          isMember: true,
          subscriptionDate: new Date(),
          planExpiry: expiryDate,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${status}`,
      membershipStatus: updatedUser.membershipStatus,
      planExpiry: updatedUser.planExpiry
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Server error updating membership" });
  }
});

export default router;
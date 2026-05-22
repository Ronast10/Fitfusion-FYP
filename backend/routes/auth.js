// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const router = express.Router();

// 1. GET USER DATA
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

// 2. REGISTER ROUTE (UPDATED FOR SECURE EMAIL VALIDATION)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate secure token sequence
    const emailToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      avatar: "avg1.png",
      streak: 0,
      lastLoggedDate: "",
      cart: [],
      purchasedItems: [],
      membershipData: {
        isMember: false,
        membershipStatus: "Free Member",
        subscriptionDate: null,
        planExpiry: null
      },
      isVerified: false, // Explicitly locked down by default
      verificationToken: emailToken,
      verificationTokenExpires: Date.now() + 3600000 // Link expires in exactly 1 hour
    });

    await newUser.save();

    // Fire off automated email verification loop dispatch
    await sendVerificationEmail(newUser.email, emailToken);

    res.status(201).json({ message: "Registration successful! A verification link has been sent to your email. Please verify it to log in." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 3. LOGIN ROUTE (UPDATED TO BLOCK UNVERIFIED USERS)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not registered" });

    // CRITICAL SECURITY CHECK: Lockout unverified emails instantly
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Your email address has not been verified yet. Please check your inbox and click the activation link to log in." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ 
      message: "Login successful",
      user: { 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar,
        streak: user.streak,
        cart: user.cart,
        purchasedItems: user.purchasedItems,
        membershipData: user.membershipData
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// NEW: EMAIL ACTIVATION LINK CALLBACK ENDPOINT
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is missing." });
    }

    // Search database for unexpired token matching our parameters
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "The verification link is invalid or has expired." });
    }

    // Activate user and wipe validation keys
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! Your account is active. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error during account verification." });
  }
});

// 4. SYNC CART (Updates the active cart in DB)
router.post("/sync-cart", async (req, res) => {
  try {
    const { email, cartItems } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { cart: cartItems } },
      { new: true }
    );
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error syncing cart" });
  }
});

// 5. COMPLETE SHOP PURCHASE (Moves items from cart to history)
router.post("/complete-purchase", async (req, res) => {
  try {
    const { email, cartItems } = req.body;
    const user = await User.findOne({ email });

    if (!user || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Determine discount based on current membership status
    const status = user.membershipData.membershipStatus.toLowerCase();
    let discountPercent = 0;
    if (status.includes("pro")) discountPercent = 0.10;
    if (status.includes("elite")) discountPercent = 0.20;

    const itemsToMove = cartItems.map(item => {
      const originalPrice = item.price; // This is the shop price
      const discountApplied = Math.round(originalPrice * discountPercent);
      const finalPrice = originalPrice - discountApplied;

      return {
        productId: item._id, // Match your updated Schema
        name: item.name,
        originalPrice: originalPrice,   // SAVED TO DB
        discountApplied: discountApplied, // SAVED TO DB
        price: finalPrice,              // SAVED TO DB
        image: item.image,
        quantity: item.quantity,
        purchaseDate: new Date()
      };
    });

    user.purchasedItems.push(...itemsToMove);
    user.cart = [];

    await user.save();
    res.status(200).json({ success: true, purchasedItems: user.purchasedItems });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ success: false, message: "Failed to record purchase" });
  }
});

// 6. VERIFY MEMBERSHIP (Updates membership status ONLY)
router.post("/verify-membership", async (req, res) => {
  try {
    const { email, amount } = req.body;
    
    let months = 0;
    let status = "Free Member";
    if (amount === 4000) { status = "Pro Member"; months = 3; } 
    else if (amount === 7000) { status = "Elite Member"; months = 6; }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "membershipData.membershipStatus": status,
          "membershipData.isMember": true,
          "membershipData.subscriptionDate": new Date(),
          "membershipData.planExpiry": expiryDate,
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${status}`,
      membershipStatus: updatedUser.membershipData.membershipStatus,
      planExpiry: updatedUser.membershipData.planExpiry
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating membership" });
  }
});

// 7. UPDATE PROFILE
router.put("/update-profile", async (req, res) => {
  try {
    const { email, name, avatar, streak, lastLoggedDate } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name, avatar, streak, lastLoggedDate } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// 8. CANCEL MEMBERSHIP (Resets status to Free)
router.post("/cancel-membership", async (req, res) => {
  try {
    const { email } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "membershipData.membershipStatus": "Free Member",
          "membershipData.isMember": false,
          "membershipData.subscriptionDate": null,
          "membershipData.planExpiry": null,
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Membership cancelled successfully",
      membershipStatus: "Free Member"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error cancelling membership" });
  }
});
// FORGOT PASSWORD ROUTE
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Save token to user model (Make sure these fields exist in your User model)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error during forgot password process." });
  }
});

// RESET PASSWORD ROUTE
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token is invalid or expired." });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error resetting password." });
  }
});

export default router;
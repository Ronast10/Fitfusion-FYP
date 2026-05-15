import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

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
      streak: 0,
      lastLoggedDate: "",
      cart: [],
      purchasedItems: [],
      membershipData: {
        isMember: false,
        membershipStatus: "Free Member",
        subscriptionDate: null,
        planExpiry: null
      }
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 3. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not registered" });

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

    const sourceItems = (user.cart && user.cart.length > 0) ? user.cart : cartItems;

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const itemsToMove = sourceItems.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      purchaseDate: new Date()
    }));

    // Add to history and clear the current cart
    user.purchasedItems.push(...itemsToMove);
    user.cart = [];

    await user.save();
    res.status(200).json({ success: true, purchasedItems: user.purchasedItems });
  } catch (error) {
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

    // Using nested dot notation to update ONLY membership fields
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
export default router;
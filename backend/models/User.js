import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "avg1.png" },
  streak: { type: Number, default: 0 }, 
  lastLoggedDate: { type: String, default: "" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  cart: [
    {
      _id: { type: String },
      name: { type: String },
      price: { type: Number },
      image: { type: String },
      quantity: { type: Number, default: 1 }
    }
  ],

  // --- ADDED PURCHASED ITEMS ---
  purchasedItems: [
    {
      productId: { type: String }, // Rename _id to productId for clarity
      name: { type: String },
      originalPrice: { type: Number },    // ADD THIS: The price before discount
      discountApplied: { type: Number },  // ADD THIS: The discount amount (e.g., 200)
      price: { type: Number },            // This is the final price the user paid
      image: { type: String },
      quantity: { type: Number },
      purchaseDate: { type: Date, default: Date.now }
    }
  ],

  membershipData: {
    membershipStatus: { 
      type: String, 
      default: "Free Member",
      enum: ["Free Member", "Pro Member", "Elite Member"] 
    },
    isMember: { type: Boolean, default: false },
    subscriptionDate: { type: Date },
    planExpiry: { type: Date }
  },

  // --- SECURE AUTHENTIC EMAIL GATEKEEPER FIELDS ---
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "avg1.png" },
  streak: { type: Number, default: 0 }, 
  lastLoggedDate: { type: String, default: "" },

  // --- ADDED CART DATA ---
  cart: [
    {
      _id: { type: String },
      name: { type: String },
      price: { type: Number },
      image: { type: String },
      quantity: { type: Number, default: 1 }
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
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
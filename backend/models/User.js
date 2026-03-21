import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "avg1.png" },
  streak: { type: Number, default: 0 }, 
  lastLoggedDate: { type: String, default: "" },

  // Membership Data
  membershipStatus: { 
    type: String, 
    default: "Free Member",
    enum: ["Free Member", "Pro Member", "Elite Member"] 
  },
  isMember: { 
    type: Boolean, 
    default: false 
  },
  subscriptionDate: { 
    type: Date 
  },
  planExpiry: {
    type: Date // This will store the 3 or 6 month calculated date
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
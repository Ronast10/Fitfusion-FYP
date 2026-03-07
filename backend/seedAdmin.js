import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    // Uses the MONGO_URI you just provided
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await Admin.findOneAndUpdate(
      { adminID: "admin@gmail.com" }, 
      { adminID: "admin@gmail.com", password: hashedPassword },
      { upsert: true, new: true }
    );

    console.log("SUCCESS: Admin 'admin@gmail.com' is now in the database.");
    process.exit();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
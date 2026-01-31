import mongoose from "mongoose";

export const testDBConnection = async () => {
  try {
    // Connect without deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connection successful!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

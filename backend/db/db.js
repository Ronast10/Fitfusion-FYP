import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Uses the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// This line is what fixes your "SyntaxError"
export default connectDB;
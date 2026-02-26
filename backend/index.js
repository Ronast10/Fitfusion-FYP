import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js"; 

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB Atlas
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes); 
// 2. REGISTER the contact routes
app.use("/api/contact", contactRoutes); 

// Base Route
app.get("/", (req, res) => {
  res.send("FitFusion Backend Running");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
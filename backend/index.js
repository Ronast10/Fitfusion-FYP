import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Database Connection
import connectDB from "./db/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js"; 
import adminRoutes from "./routes/adminAuth.js"; 
import paypalRoutes from "./routes/paypalRoutes.js";
import esewaRoutes from "./routes/esewaRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB Atlas
connectDB();

// API Routes
app.use("/api/auth", authRoutes);       // User Login/Register
app.use("/api/products", productRoutes); // Product CRUD
app.use("/api/messages", messageRoutes); // User Messages
app.use("/api/contact", contactRoutes);   // Contact Form
app.use("/api/admin", adminRoutes);       // Admin Login logic
app.use("/api/paypal", paypalRoutes);
app.use("/api/esewa", esewaRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("FitFusion Backend Running");
});

// 404 Handler (Catch-all for routes that don't exist)
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
  console.log(`🔒 Admin Routes Active at: http://localhost:${PORT}/api/admin/login`);
});
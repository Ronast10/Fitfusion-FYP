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
import adminAuthRoutes from "./routes/adminAuth.js"; 
import adminDashboardRoutes from "./models/Admin.js"; 
import paypalRoutes from "./routes/paypalRoutes.js";
import esewaRoutes from "./routes/esewaRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
// FIX: Be explicit with CORS if you face issues with port 5173
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); 

// Connect to MongoDB Atlas
connectDB();

// API Routes
app.use("/api/auth", authRoutes);          
app.use("/api/products", productRoutes); 
app.use("/api/messages", messageRoutes); 
app.use("/api/contact", contactRoutes);   

// FIX: Separate Auth from Dashboard Management
app.use("/api/admin/auth", adminAuthRoutes);    // Login will now be /api/admin/auth/login
app.use("/api/admin", adminDashboardRoutes);    // Dashboard will be /api/admin/dashboard-stats

app.use("/api/paypal", paypalRoutes);
app.use("/api/esewa", esewaRoutes);

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
  console.log(`🔒 Admin Auth: http://localhost:${PORT}/api/admin/auth/login`);
  console.log(`📊 Admin Stats: http://localhost:${PORT}/api/admin/dashboard-stats`);
});
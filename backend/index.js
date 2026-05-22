import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; 
import { fileURLToPath } from "url"; // For ES Modules path handling

import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js"; 
import adminAuthRoutes from "./routes/adminAuth.js"; 
import esewaRoutes from "./routes/esewaRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"; 
import khaltiRoutes from "./routes/khaltiRoutes.js";
import classRoutes from "./routes/classRoutes.js";

dotenv.config();
const app = express();

// Path setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); 

// 3. CRITICAL: Serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);          
app.use("/api/products", productRoutes); 
app.use("/api/messages", messageRoutes); 
app.use("/api/contact", contactRoutes);   

app.use("/api/admin", adminAuthRoutes);   

app.use("/api/khalti", khaltiRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/videos", videoRoutes);
app.use('/api/classes', classRoutes);
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
  console.log(`🔒 Admin Auth: http://localhost:${PORT}/api/admin/login`);
  console.log(`📊 Admin Stats: http://localhost:${PORT}/api/admin/dashboard-stats`);
});
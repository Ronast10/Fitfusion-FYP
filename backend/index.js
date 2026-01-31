import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { testDBConnection } from "./db/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
testDBConnection();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

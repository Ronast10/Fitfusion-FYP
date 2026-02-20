import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// This matches: GET http://localhost:5000/api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// This matches: POST http://localhost:5000/api/products/add
router.post("/add", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// IMPORTANT: Check that you are exporting the router like this
export default router;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Protein, Accessories
  image: { type: String, required: true },    // URL of the image
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
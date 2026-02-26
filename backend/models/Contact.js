import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // Changed from 'phone' to match frontend usage
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

// Mongoose will create a 'contacts' collection automatically
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
export default Contact;
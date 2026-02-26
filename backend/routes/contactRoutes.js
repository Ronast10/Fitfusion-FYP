import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      subject,
      message
    });

    await newContact.save(); // This is what creates the collection in MongoDB Atlas
    res.status(201).json({ success: true, message: "Message stored in FitFusion!" });
  } catch (error) {
    console.error("Database Save Error:", error);
    res.status(500).json({ success: false, message: "Server failed to save message." });
  }
});

export default router;
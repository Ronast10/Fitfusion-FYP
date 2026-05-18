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
// 2. ADD THIS GET ROUTE: Fetches all messages from the 'contacts' collection for the Admin Panel
router.get("/all", async (req, res) => {
  try {
    // Fetches all contacts from DB and sorts by newest first (using the automatic createdAt timestamps)
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server failed to fetch messages." });
  }
});

export default router;
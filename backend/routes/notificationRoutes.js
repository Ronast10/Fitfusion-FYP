import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Fetch all notifications matching ID, email, or username variables dynamically
router.get("/:userIdentifier", async (req, res) => {
  try {
    const { userIdentifier } = req.params;

    // Search the collection if recipientId matches ANY of these criteria
    const notifications = await Notification.find({
      $or: [
        { recipientId: userIdentifier },
        { recipientId: decodeURIComponent(userIdentifier) } 
      ]
    })
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notifications as read matching the same criteria
router.put("/mark-read/:userIdentifier", async (req, res) => {
  try {
    const { userIdentifier } = req.params;

    await Notification.updateMany(
      {
        $or: [
          { recipientId: userIdentifier },
          { recipientId: decodeURIComponent(userIdentifier) }
        ],
        isRead: false
      },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification states" });
  }
});
// Delete a single notification by its database ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    res.json({ success: true, message: "Notification removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification record" });
  }
});

export default router;
import express from 'express';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// --- NEW ROUTE FOR ADMIN PANEL: Fetches all message logs globally ---
router.get('/', async (req, res) => {
    try {
        // Fetches all messages from the database and sorts them by newest first
        const allMessages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, messages: allMessages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send Route
router.post('/send', async (req, res) => {
    try {
        const { trainerId, userId, senderName, senderRole, content } = req.body;
        
        const newMessage = new Message({
            trainerId,
            userId,
            senderName,
            senderRole,
            content
        });
        await newMessage.save();

        // Dynamically shift target destinations: if client sends it, alert the trainer, and vice versa.
        const recipientId = senderRole === 'user' ? trainerId : userId;
        
        // Formulate a clean preview string for the toast layouts
        const previewText = content.length > 45 ? `${content.substring(0, 45)}...` : content;

        const newNotification = new Notification({
            recipientId,
            senderName,
            messagePreview: previewText,
            type: 'chat', // Explicitly maps to your schema layout option
            isRead: false
        });
        await newNotification.save();

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get history for a specific conversation
router.get('/history/:trainerId/:userId', async (req, res) => {
    try {
        const history = await Message.find({
            trainerId: req.params.trainerId,
            userId: req.params.userId
        }).sort({ createdAt: 1 });
        res.json({ success: true, messages: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//  Delete an individual trainer inquiry message by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id.trim();
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        res.status(200).json({ success: true, message: "Record successfully removed!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
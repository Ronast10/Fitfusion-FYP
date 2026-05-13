import express from 'express';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Updated Send Route
router.post('/send', async (req, res) => {
    try {
        const { trainerId, userId, senderName, senderRole, content } = req.body;
        
        // 1. Save the message
        const newMessage = new Message({
            trainerId,
            userId,
            senderName,
            senderRole,
            content
        });
        await newMessage.save();

        // 2. Create a notification for the recipient
        const recipientId = senderRole === 'user' ? trainerId : userId;
        const newNotification = new Notification({
            recipientId,
            senderName,
            messagePreview: content.substring(0, 50) // Short preview
        });
        await newNotification.save();

        res.status(201).json({ success: true, message: "Sent!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// NEW: Get history for a specific conversation
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

export default router;
import express from 'express'; // Changed from require
const router = express.Router();
import Message from '../models/Message.js'; // Changed from require (added .js)

// POST route to save a message
router.post('/send', async (req, res) => {
    try {
        const { trainerName, senderName, content } = req.body;
        
        const newMessage = new Message({
            trainerName,
            senderName,
            content
        });

        await newMessage.save();
        res.status(201).json({ success: true, message: "Message stored successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router; // Changed from module.exports
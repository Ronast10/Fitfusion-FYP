import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    // Using IDs instead of just names makes the system much more stable
    trainerId: { type: String, required: true }, 
    userId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { 
        type: String, 
        enum: ['user', 'trainer'], 
        required: true 
    }, 
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false } // For your future notification system
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
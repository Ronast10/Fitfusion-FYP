import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipientId: { 
        type: String, 
        required: true,
        index: true // Adds an index to make queries super fast when fetching for a specific user
    }, 
    senderName: { 
        type: String, 
        required: true 
    },
    messagePreview: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        default: 'chat' // Useful later if you add 'payment', 'booking', or 'system' notifications
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
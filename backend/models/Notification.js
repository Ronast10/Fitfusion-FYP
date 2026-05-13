import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipientId: { type: String, required: true }, // Who gets the alert
    senderName: { type: String, required: true },
    messagePreview: { type: String, required: true },
    type: { type: String, default: 'chat' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    trainerName: { type: String, required: true },
    senderName: { type: String, required: true }, 
    content: { type: String, required: true },
}, { timestamps: true }); // Use this instead of manual createdAt

export default mongoose.model('Message', MessageSchema);
import { Schema, model } from 'mongoose';

const ClassSchema = new Schema({
    title: { type: String, required: true },
    focus: String,
    day: String,
    time: String,
    link: String,
    description: String,
    image: String
});

export default model('Class', ClassSchema);
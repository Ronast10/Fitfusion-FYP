import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  videoId: { type: String, required: true }, // The YouTube ID only
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
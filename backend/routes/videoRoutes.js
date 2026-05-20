import express from "express";
import Video from "../models/Video.js";

const router = express.Router();

// GET all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// POST new video (Admin use)
router.post("/", async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: "Error saving video" });
  }
});
// DELETE a video by ID
router.delete("/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Video removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video" });
  }
});

export default router;
import express from 'express';
import multer from 'multer';
import Class from "../models/Class.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Fetch all classes
router.get('/', async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch classes" });
    }
});

// Add a new class (with image support)
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, focus, day, time, link, description } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        
        const newClass = await Class.create({
            title, focus, day, time, link, description, image: imagePath
        });
        res.json(newClass);
    } catch (err) {
        res.status(500).json({ error: "Failed to add class" });
    }
});

// Delete a class
router.delete('/:id', async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Class deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

export default router;
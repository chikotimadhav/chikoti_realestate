// ============================================================
// UPLOAD ROUTE — base64 image to disk & video upload
// ============================================================
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.mp4';
    const fname = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, fname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.post('/base64', authenticate, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image?.startsWith('data:image'))
      return res.status(400).json({ error: 'Invalid image data' });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const ext        = image.match(/data:image\/(\w+);/)?.[1] || 'jpg';
    const fname      = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir  = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fname), base64Data, 'base64');

    const url = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${fname}`;
    res.json({ success: true, data: { url } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/upload/video
router.post('/video', authenticate, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }
    const url = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

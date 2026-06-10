// ============================================================
// REEL ROUTES
// ============================================================
const express = require('express');
const Reel = require('../models/Reel');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/reels — Public: Get all active reels
router.get('/', async (_req, res) => {
  try {
    const activeReels = await Reel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: activeReels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin management endpoints below
router.use(authenticate, requireRole('admin'));

// GET /api/reels/all — Admin: Get all reels (active & inactive)
router.get('/all', async (_req, res) => {
  try {
    const allReels = await Reel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: allReels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reels — Admin: Add a new reel
router.post('/', async (req, res) => {
  try {
    const { title, videoUrl, description, aspectRatio } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: 'Reel Video URL is required' });
    }

    const reel = await Reel.create({
      title: title || '',
      videoUrl,
      description: description || '',
      aspectRatio: aspectRatio || '9/16',
      isActive: true,
    });

    res.status(201).json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reels/:id — Admin: Update details or toggle active/inactive status
router.patch('/:id', async (req, res) => {
  try {
    const { title, videoUrl, description, aspectRatio, isActive } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (description !== undefined) updateData.description = description;
    if (aspectRatio !== undefined) updateData.aspectRatio = aspectRatio;
    if (isActive !== undefined) updateData.isActive = isActive;

    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reels/:id — Admin: Delete a reel
router.delete('/:id', async (req, res) => {
  try {
    const reel = await Reel.findByIdAndDelete(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }
    res.json({ success: true, message: 'Reel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// ============================================================
// REEL ROUTES
// ============================================================
const express = require('express');
const Reel = require('../models/Reel');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/reels — Public: Get all active & approved reels for the buyer portal
router.get('/', async (_req, res) => {
  try {
    const activeReels = await Reel.find({ status: 'approved', isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: activeReels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reels/seller/mine — Seller: Get all reels uploaded by this seller
router.get('/seller/mine', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const mine = await Reel.find({ seller_id: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: mine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reels — Seller/Admin: Create a new reel (pending approval for sellers)
router.post('/', authenticate, requireRole('seller', 'admin'), async (req, res) => {
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
      seller_id: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    res.status(201).json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reels/:id — Seller/Admin: Edit details or update status (admin-only fields status/isActive)
router.patch('/:id', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Check ownership: sellers can only edit their own reels
    if (reel.seller_id?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: You do not own this reel' });
    }

    const { title, videoUrl, description, aspectRatio, isActive, status } = req.body;
    const updateData = {};

    if (title !== undefined)       updateData.title = title;
    if (videoUrl !== undefined)    updateData.videoUrl = videoUrl;
    if (description !== undefined)  updateData.description = description;
    if (aspectRatio !== undefined)  updateData.aspectRatio = aspectRatio;

    if (req.user.role === 'admin') {
      if (isActive !== undefined) updateData.isActive = isActive;
      if (status !== undefined)   updateData.status = status;
    } else {
      // Sellers editing resets status back to pending
      updateData.status = 'pending';
    }

    const updated = await Reel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reels/:id — Seller/Admin: Delete a reel
router.delete('/:id', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Check ownership: sellers can only delete their own reels
    if (reel.seller_id?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: You do not own this reel' });
    }

    await reel.deleteOne();
    res.json({ success: true, message: 'Reel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reels/all — Admin: Get all reels (including inactive/pending/rejected) with uploader info
router.get('/all', authenticate, requireRole('admin'), async (_req, res) => {
  try {
    const allReels = await Reel.find()
      .populate('seller_id', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: allReels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

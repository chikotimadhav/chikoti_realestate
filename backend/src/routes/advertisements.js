// ============================================================
// ADVERTISEMENT ROUTES
// ============================================================
const express       = require('express');
const Advertisement = require('../models/Advertisement');
const { authenticate, requireRole } = require('../middleware/auth');
const path          = require('path');
const fs            = require('fs');

const router = express.Router();

// GET /api/advertisements/active — Public: Get current active ad
router.get('/active', async (_req, res) => {
  try {
    const activeAd = await Advertisement.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: activeAd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin management endpoints below
router.use(authenticate, requireRole('admin'));

// GET /api/advertisements — Admin: Get all ads
router.get('/', async (_req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/advertisements — Admin: Create new ad
router.post('/', async (req, res) => {
  try {
    const { image, title, link } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Set all existing ads to inactive
    await Advertisement.updateMany({}, { isActive: false });

    // Create the new ad as active by default, storing base64 directly to support all envs
    const ad = await Advertisement.create({
      imageUrl: image,
      title: title || '',
      link: link || '',
      isActive: true,
    });

    res.status(201).json({ success: true, data: ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/advertisements/:id/active — Admin: Set specific ad as active/inactive
router.patch('/:id/active', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (isActive) {
      // Deactivate all first
      await Advertisement.updateMany({}, { isActive: false });
    }

    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json({ success: true, data: ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/advertisements/:id — Admin: Delete ad and its file from disk
router.delete('/:id', async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    // If file is stored on server disk, try deleting it
    if (ad.imageUrl && ad.imageUrl.includes('/uploads/ad_')) {
      try {
        const parts = ad.imageUrl.split('/uploads/');
        const fname = parts[parts.length - 1];
        const filePath = path.join(__dirname, '../../uploads', fname);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.error('Failed to delete ad image file from disk:', fileErr);
      }
    }

    await ad.deleteOne();
    res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

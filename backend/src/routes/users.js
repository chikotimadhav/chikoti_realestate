// ============================================================
// USERS ROUTES — favorites
// ============================================================
const express   = require('express');
const Favorite  = require('../models/Favorite');
const Property  = require('../models/Property');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const favs = await Favorite.find({ user_id: req.user._id })
      .populate('property_id').lean();
    const data = favs.map(f => f.property_id).filter(Boolean);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/users/favorites/:propId — toggle
router.post('/favorites/:propId', authenticate, async (req, res) => {
  try {
    const existing = await Favorite.findOne({ user_id: req.user._id, property_id: req.params.propId });
    if (existing) {
      await existing.deleteOne();
      res.json({ success: true, favorited: false });
    } else {
      await Favorite.create({ user_id: req.user._id, property_id: req.params.propId });
      res.json({ success: true, favorited: true });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

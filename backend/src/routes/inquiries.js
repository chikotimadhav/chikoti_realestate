// ============================================================
// INQUIRIES ROUTES
// ============================================================
const express  = require('express');
const Inquiry  = require('../models/Inquiry');
const Property = require('../models/Property');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries — buyer sends inquiry
router.post('/', async (req, res) => {
  try {
    const { property_id, buyer_name, buyer_email, buyer_phone, message } = req.body;
    if (!property_id || !buyer_name || !buyer_email || !buyer_phone)
      return res.status(400).json({ error: 'All fields are required' });

    await Inquiry.create({ property_id, buyer_name, buyer_email, buyer_phone, message });
    await Property.findByIdAndUpdate(property_id, { $inc: { views: 1 } });
    res.status(201).json({ success: true, message: 'Inquiry sent!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/inquiries/seller — seller's inquiries
router.get('/seller', authenticate, async (req, res) => {
  try {
    // Get seller's property IDs first
    const myProps = await Property.find({ seller_id: req.user._id }).select('_id title');
    const propIds = myProps.map(p => p._id);

    const inquiries = await Inquiry.find({ property_id: { $in: propIds } })
      .populate('property_id', 'title land_type')
      .sort({ createdAt: -1 })
      .lean();

    // Flatten for easy frontend consumption
    const data = inquiries.map(i => ({
      ...i,
      property_title: i.property_id?.title,
      land_type:      i.property_id?.land_type,
      property_id:    i.property_id?._id,
    }));

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

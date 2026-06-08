// ============================================================
// ADMIN ROUTES
// ============================================================
const express  = require('express');
const Property = require('../models/Property');
const User     = require('../models/User');
const Inquiry  = require('../models/Inquiry');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

// GET /api/admin/stats
router.get('/stats', async (_req, res) => {
  try {
    const [total, pending, approved, users, sellers, inquiries, viewsAgg] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'approved' }),
      User.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      Inquiry.countDocuments(),
      Property.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    ]);
    res.json({ success: true, data: {
      properties: total, pending, approved,
      users, sellers, inquiries,
      views: viewsAgg[0]?.total || 0,
    }});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/properties?status=pending
router.get('/properties', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const properties = await Property.find(filter)
      .populate('seller_id', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    const data = properties.map(p => ({
      ...p,
      seller_name:  p.seller_id?.name,
      seller_email: p.seller_id?.email,
    }));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/properties/:id/status
router.patch('/properties/:id/status', async (req, res) => {
  try {
    const { status, is_featured = false } = req.body;
    if (!['approved', 'rejected', 'pending', 'sold'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    await Property.findByIdAndUpdate(req.params.id, { status, is_featured });
    res.json({ success: true, message: `Property ${status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/users
router.get('/users', async (_req, res) => {
  try {
    const data = await User.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', async (req, res) => {
  try {
    const { is_active, is_verified } = req.body;
    await User.findByIdAndUpdate(req.params.id, { is_active, is_verified });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/inquiries
router.get('/inquiries', async (_req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property_id', 'title land_type')
      .sort({ createdAt: -1 })
      .lean();

    const data = inquiries.map(i => ({
      ...i,
      property_title: i.property_id?.title,
      land_type:      i.property_id?.land_type,
    }));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

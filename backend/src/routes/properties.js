// ============================================================
// PROPERTIES ROUTES
// ============================================================
const express  = require('express');
const Property = require('../models/Property');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/properties — approved listings with filters
router.get('/', async (req, res) => {
  try {
    const { type, listing, search, sort, limit = 20, offset = 0 } = req.query;
    const query = { status: { $in: ['approved', 'sold'] } };

    if (type)    query.land_type    = type;
    if (listing) query.listing_type = listing;
    if (search)  query.$text = { $search: search };

    let q = Property.find(query).skip(Number(offset)).limit(Number(limit));
    if (sort === 'price_asc')  q = q.sort({ price:  1 });
    else if (sort === 'price_desc') q = q.sort({ price: -1 });
    else                            q = q.sort({ createdAt: -1 });

    const data = await q.lean();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/properties/featured
router.get('/featured', async (_req, res) => {
  try {
    const data = await Property.find({ status: 'approved', is_featured: true })
      .sort({ createdAt: -1 }).limit(6).lean();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/properties/seller/mine  (must be before /:id)
router.get('/seller/mine', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const data = await Property.find({ seller_id: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/properties/:id — increment views
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).lean();
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/properties — seller creates listing
router.post('/', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, seller_id: req.user._id, status: 'pending' });
    res.status(201).json({ success: true, data: { id: property._id, tokenId: property.tokenId }, message: 'Property submitted for review' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/properties/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Not found' });
    if (property.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });
    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

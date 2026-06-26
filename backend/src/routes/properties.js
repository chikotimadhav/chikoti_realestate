// ============================================================
// PROPERTIES ROUTES
// ============================================================
const express  = require('express');
const Property = require('../models/Property');
const Inquiry  = require('../models/Inquiry');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/properties — approved listings with filters
router.get('/', async (req, res) => {
  try {
    const { type, listing, search, sort, limit = 20, offset = 0 } = req.query;
    const query = { status: { $in: ['approved', 'sold'] } };

    if (type)    query.land_type    = type;
    if (listing) query.listing_type = listing;
    if (search) {
      const trimmedSearch = search.trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmedSearch);
      const isNumeric = /^\d+$/.test(trimmedSearch);

      const conditions = [];
      conditions.push({ $text: { $search: trimmedSearch } });

      if (isObjectId) {
        conditions.push({ _id: trimmedSearch });
      }
      if (isNumeric) {
        conditions.push({ tokenId: Number(trimmedSearch) });
      }

      query.$or = conditions;
    }

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

// GET /api/properties/seller/analytics (must be before /:id)
router.get('/seller/analytics', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const myProps = await Property.find({ seller_id: req.user._id }).lean();
    const propIds = myProps.map(p => p._id);

    const inquiries = await Inquiry.find({ property_id: { $in: propIds } }).lean();

    // 1. Total Views
    const totalViews = myProps.reduce((sum, p) => sum + (p.views || 0), 0);

    // 2. Total Leads / Inquiries
    const totalLeads = inquiries.length;

    // 3. Inquiry Conversion Rate
    const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : 0;

    // 4. Most Viewed Property
    let mostViewed = null;
    if (myProps.length > 0) {
      mostViewed = myProps.reduce((max, p) => (p.views || 0) > (max.views || 0) ? p : max, myProps[0]);
    }

    // 5. Weekly Trend (Inquiries over the last 7 days)
    const weeklyTrend = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      const dateString = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      const count = inquiries.filter(inq => {
        const inqDate = new Date(inq.createdAt || inq.created_at);
        return inqDate.getDate() === d.getDate() &&
               inqDate.getMonth() === d.getMonth() &&
               inqDate.getFullYear() === d.getFullYear();
      }).length;

      weeklyTrend.push({ day: dayName, date: dateString, leads: count });
    }

    // 6. Per-property breakdown
    const propertiesBreakdown = myProps.map(p => {
      const pInqs = inquiries.filter(inq => inq.property_id.toString() === p._id.toString());
      const leadsCount = pInqs.length;
      const siteVisitsCount = pInqs.filter(inq => inq.status === 'Site Visit Scheduled').length;
      return {
        id: p._id.toString(),
        title: p.title,
        views: p.views || 0,
        leads: leadsCount,
        siteVisits: siteVisitsCount,
        conversion: p.views > 0 ? ((leadsCount / p.views) * 100).toFixed(1) : 0
      };
    });

    res.json({
      success: true,
      data: {
        totalViews,
        totalLeads,
        conversionRate,
        mostViewed: mostViewed ? { id: mostViewed._id, title: mostViewed.title, views: mostViewed.views } : null,
        weeklyTrend,
        propertiesBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// PUT /api/properties/:id — seller updates their listing
router.put('/:id', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });

    const updateData = { ...req.body };
    // Force status to pending for re-approval unless edited by admin
    if (req.user.role !== 'admin') {
      updateData.status = 'pending';
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updated, message: 'Property details updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

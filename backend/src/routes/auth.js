// ============================================================
// AUTH ROUTES — register / login / me
// ============================================================
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chikoti_secret_2024';

function makeToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'buyer' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (!['buyer', 'seller'].includes(role))
      return res.status(400).json({ error: 'Invalid role' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const user  = await User.create({ name, email, phone, password, role });
    const token = makeToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase(), is_active: true }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = makeToken(user);
    res.json({ success: true, data: { user, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;

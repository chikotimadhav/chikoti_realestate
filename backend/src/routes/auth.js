// ============================================================
// AUTH ROUTES — register / login / me
// ============================================================
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chikoti_secret_2024';

const ALLOWED_ADMIN_EMAILS = [
  'madhavchikoti92@gmail.com',
  'admin2@chikotirealestate.com',
  'admin3@chikotirealestate.com'
];

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

    const emailLower = email.toLowerCase();

    // Prevent registration of allowed admin emails
    if (ALLOWED_ADMIN_EMAILS.includes(emailLower)) {
      return res.status(400).json({ error: 'Registration is not allowed for admin email addresses.' });
    }

    const exists = await User.findOne({ email: emailLower });
    if (exists) {
      // Allow sharing/upgrading same email for seller and buyer
      if (exists.role === 'buyer' && role === 'seller') {
        exists.role = 'seller'; // upgrade buyer to seller so they can access both portals
        if (password) exists.password = password;
        if (phone) exists.phone = phone;
        if (name) exists.name = name;
        await exists.save();
        const token = makeToken(exists);
        return res.status(200).json({ success: true, data: { user: exists, token } });
      }
      
      if (exists.role === 'seller' && role === 'buyer') {
        return res.status(400).json({ error: 'This email is already registered as a seller. You can log in directly using your credentials.' });
      }

      return res.status(409).json({ error: 'Email already registered' });
    }

    const user  = await User.create({ name, email: emailLower, phone, password, role });
    const token = makeToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email?.toLowerCase();
    
    const user = await User.findOne({ email: emailLower, is_active: true }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Enforce admin login and email restrictions
    const is_admin_email = ALLOWED_ADMIN_EMAILS.includes(emailLower);
    if (is_admin_email && user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Authorized admin emails cannot be used for buyer or seller accounts.' });
    }
    if (user.role === 'admin' && !is_admin_email) {
      return res.status(403).json({ error: 'Access denied: Email is not an authorized admin email.' });
    }

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

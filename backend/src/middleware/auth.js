// ============================================================
// JWT AUTH MIDDLEWARE
// ============================================================
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'chikoti_secret_2024';

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token   = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user    = await User.findById(decoded.id).where({ is_active: true });
    if (!user) return res.status(401).json({ error: 'User not found or suspended' });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    next();
  };
}

module.exports = { authenticate, requireRole };

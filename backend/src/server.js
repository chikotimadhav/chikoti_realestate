// ============================================================
// CHIKOTI REAL ESTATE — EXPRESS API SERVER (MongoDB)
// ============================================================
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const connectDB = require('./config/db');
const User      = require('./models/User');

const authRoutes      = require('./routes/auth');
const propertyRoutes  = require('./routes/properties');
const inquiryRoutes   = require('./routes/inquiries');
const userRoutes      = require('./routes/users');
const uploadRoutes    = require('./routes/upload');
const adminRoutes     = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB, then start server ──────────────────
connectDB().then(async () => {
  await User.seedAdmin();   // seed admin only if none exists

  // ── Middleware ─────────────────────────────────────────
  // Map _id to id recursively for all JSON responses for frontend compatibility
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
      function assignId(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach(assignId);
          return;
        }
        if (obj.constructor && obj.constructor !== Object) return;
        if (obj._id && !obj.id) {
          obj.id = obj._id.toString();
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            assignId(obj[key]);
          }
        }
      }
      assignId(body);
      return originalJson.call(this, body);
    };
    next();
  });

  app.use(cors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://www.chikotirealestate.com',
      'https://seller.chikotirealestate.com',
      'https://admin.chikotirealestate.com',
    ],
    credentials: true,
  }));
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // ── Routes ─────────────────────────────────────────────
  app.use('/api/auth',       authRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/inquiries',  inquiryRoutes);
  app.use('/api/users',      userRoutes);
  app.use('/api/upload',     uploadRoutes);
  app.use('/api/admin',      adminRoutes);

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: 'mongodb', time: new Date() }));

  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  app.listen(PORT, () =>
    console.log(`\n🚀 Chikoti API → http://localhost:${PORT}\n`)
  );
});
// Nodemon trigger comment v2


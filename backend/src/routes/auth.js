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
    const identifier = email?.trim().toLowerCase();
    
    // Find user by either email or phone
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier }
      ],
      is_active: true
    }).select('+password');

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Enforce admin login and email restrictions using the registered user's email
    const is_admin_email = ALLOWED_ADMIN_EMAILS.includes(user.email);
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

// ── Password Reset Logic ─────────────────────────────────
const nodemailer = require('nodemailer');

async function sendResetEmail(email, code) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  const text = `Hello,\n\nYour password reset verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nChikoti Real Estate Team`;

  console.log(`\n===============================================\n📧 RESET PASSWORD CODE FOR: ${email}\n🔑 CODE: ${code}\n===============================================\n`);

  if (!user || !pass) {
    console.warn('⚠️ SMTP email credentials (EMAIL_USER/EMAIL_PASS) are not set in .env. Falling back to console logging.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Chikoti Real Estate" <${user}>`,
      to: email,
      subject: 'Password Reset Verification Code - Chikoti Real Estate',
      text: text
    });
    console.log(`📧 Reset email successfully sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send reset email:', error);
  }
}

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase(), is_active: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email address' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_password_code = code;
    user.reset_password_expires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendResetEmail(user.email, code);

    res.json({ success: true, message: 'Verification code sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-reset-code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const user = await User.findOne({
      email: email.toLowerCase(),
      reset_password_code: code,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      reset_password_code: code,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    user.password = newPassword;
    user.reset_password_code = '';
    user.reset_password_expires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

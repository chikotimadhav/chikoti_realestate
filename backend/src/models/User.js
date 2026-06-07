// ============================================================
// USER MODEL
// ============================================================
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:       { type: String, default: '' },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  avatar_url:  { type: String, default: '' },
  is_verified: { type: Boolean, default: false },
  is_active:   { type: Boolean, default: true },
  reset_password_code: { type: String, default: '' },
  reset_password_expires: { type: Date },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Seed permanent admins on first run
userSchema.statics.seedAdmin = async function () {
  const allowedAdminEmails = [
    'madhavchikoti92@gmail.com',
    'admin2@chikotirealestate.com',
    'admin3@chikotirealestate.com'
  ];

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  for (const email of allowedAdminEmails) {
    const exists = await this.findOne({ email });
    if (!exists) {
      await this.create({
        name: email === 'madhavchikoti92@gmail.com' ? 'Madhav Chikoti' : `Admin (${email.split('@')[0]})`,
        email: email,
        password: adminPassword,
        role: 'admin',
        is_verified: true,
      });
      console.log(`👤 Permanent admin seeded: ${email}`);
    }
  }
};

module.exports = mongoose.model('User', userSchema);

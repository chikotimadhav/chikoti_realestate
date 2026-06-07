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

// Seed default admin on first run
userSchema.statics.seedAdmin = async function () {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️ Seeding admin aborted: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set.');
    return;
  }

  const exists = await this.findOne({ email: adminEmail });
  if (exists) return;

  await this.create({
    name: 'Chikoti Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    is_verified: true,
  });
  console.log(`👤 Default admin seeded: ${adminEmail}`);
};

module.exports = mongoose.model('User', userSchema);

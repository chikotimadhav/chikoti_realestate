// ============================================================
// ADVERTISEMENT MODEL
// ============================================================
const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title:    { type: String, default: '' },
  link:     { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', advertisementSchema);

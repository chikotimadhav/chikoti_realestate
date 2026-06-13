// ============================================================
// REEL MODEL
// ============================================================
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  title:       { type: String, default: '' },
  videoUrl:    { type: String, required: true },
  description: { type: String, default: '' },
  aspectRatio: { type: String, default: '9/16' },
  isActive:    { type: Boolean, default: true },
  seller_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);

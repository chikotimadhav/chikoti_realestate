// ============================================================
// INQUIRY MODEL
// ============================================================
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyer_name:  { type: String, required: true, trim: true },
  buyer_email: { type: String, required: true, lowercase: true },
  buyer_phone: { type: String, required: true },
  message:     { type: String, default: '' },
  status:      { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

inquirySchema.index({ property_id: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);

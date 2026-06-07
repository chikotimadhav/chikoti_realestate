// ============================================================
// PROPERTY MODEL
// ============================================================
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  seller_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:          { type: String, required: true, trim: true },
  land_type:      { type: String, enum: ['Agriculture', 'Commercial', 'Residential'], required: true },
  listing_type:   { type: String, enum: ['Sale', 'Rent', 'Lease'], default: 'Sale' },
  price:          { type: Number, required: true },
  location:       { type: String, required: true },
  lat:            { type: Number },
  lng:            { type: Number },
  description:    { type: String, default: '' },
  images:         [{ type: String }],        // array of URLs / base64
  contact_number: { type: String, required: true },
  whatsapp_number:{ type: String, default: '' },
  status:         { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  is_featured:    { type: Boolean, default: false },
  views:          { type: Number, default: 0 },

  // ── Agriculture fields ──────────────────────────────────
  acres:           { type: Number },
  soil_type:       { type: String },
  water_source:    { type: String },
  current_crop:    { type: String },
  crop_yield:      { type: Number },
  electricity:     { type: String },
  fencing:         { type: String },
  agri_facilities: [{ type: String }],

  // ── Commercial fields ───────────────────────────────────
  built_area:     { type: Number },
  floor:          { type: String },
  frontage:       { type: Number },
  business_type:  { type: String },
  parking:        { type: String },
  footfall:       { type: String, enum: ['Low', 'Medium', 'High'] },
  landmarks:      { type: String },
  comm_amenities: [{ type: String }],

  // ── Residential fields ──────────────────────────────────
  area_sqft:      { type: Number },
  bedrooms:       { type: Number },
  bathrooms:      { type: Number },
  furnishing:     { type: String, enum: ['Unfurnished', 'Semi-furnished', 'Fully Furnished'] },
  res_floor:      { type: String },
  res_amenities:  [{ type: String }],
}, { timestamps: true });

// Text index for search
propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ status: 1, is_featured: 1 });
propertySchema.index({ seller_id: 1 });

module.exports = mongoose.model('Property', propertySchema);

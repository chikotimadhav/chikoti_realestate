// ============================================================
// PROPERTY MODEL
// ============================================================
const mongoose = require('mongoose');
const Counter = require('./Counter');


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
  
  tokenId:        { type: Number, unique: true },
}, { timestamps: true });

// Pre-save hook to generate sequential tokenId (e.g., 20260001, 20260002)
propertySchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew && !doc.tokenId) {
    const Counter = mongoose.model('Counter');
    const counter = await Counter.findOneAndUpdate(
      { id: 'property_token_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.tokenId = 20260000 + counter.seq;
  }
  next();
});

// Static method to migrate existing properties that lack a tokenId
propertySchema.statics.migrateTokenIds = async function () {
  const propertiesWithoutToken = await this.find({ tokenId: { $exists: false } });
  if (propertiesWithoutToken.length > 0) {
    console.log(`\n🔄 [MIGRATION] Found ${propertiesWithoutToken.length} properties without token ID. Assigning sequential IDs...`);
    const Counter = mongoose.model('Counter');
    for (const prop of propertiesWithoutToken) {
      const counter = await Counter.findOneAndUpdate(
        { id: 'property_token_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      prop.tokenId = 20260000 + counter.seq;
      await prop.save();
      console.log(`✅ [MIGRATION] Assigned tokenId #${prop.tokenId} to property: "${prop.title}"`);
    }
    console.log(`\n🎉 [MIGRATION] Completed tokenId migration.\n`);
  }
};

// Text index for search
propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ status: 1, is_featured: 1 });
propertySchema.index({ seller_id: 1 });

module.exports = mongoose.model('Property', propertySchema);


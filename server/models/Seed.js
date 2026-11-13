const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Seed name is required'],
    trim: true,
  },
  vernacularNames: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    mr: { type: String, required: true },
  },
  scientificName: {
    type: String,
    required: [true, 'Scientific name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Herbs', 'Pulses', 'Grains', 'Flowers'],
    required: [true, 'Category is required'],
  },
  description: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    mr: { type: String, default: '' },
  },
  packetWeightGrams: {
    type: Number,
    required: [true, 'Packet weight in grams is required'],
  },
  packetWeightDisplay: {
    type: String,
    default: '25g',
  },
  pricePerPacket: {
    type: Number,
    required: [true, 'Price per packet is required'],
    min: [0, 'Price must be non-negative'],
  },
  initialStock: {
    type: Number,
    required: true,
    min: 0,
  },
  availableStock: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPurchased: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalBorrowed: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalReturned: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalDeposited: {
    type: Number,
    default: 0,
    min: 0,
  },
  growingSeason: {
    type: String,
    default: 'Year-round / Kharif',
  },
  germinationPeriod: {
    type: String,
    default: '5 - 10 Days',
  },
  harvestPeriod: {
    type: String,
    default: '60 - 90 Days',
  },
  sunlight: {
    type: String,
    default: 'Full Sunlight (6-8 hours daily)',
  },
  soilRequirements: {
    type: String,
    default: 'Well-draining, fertile loamy soil enriched with organic compost (pH 6.0 - 7.0)',
  },
  watering: {
    type: String,
    default: 'Moderate, keep soil uniformly moist but not waterlogged',
  },
  growingInstructions: {
    type: String,
    default: 'Sow seeds at 1/2 inch depth in prepared beds or seed trays. Water gently. Protect young seedlings from harsh midday sun until established.',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  lowStockThreshold: {
    type: Number,
    default: 15,
  },
  isHeritageVariety: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Seed', seedSchema);


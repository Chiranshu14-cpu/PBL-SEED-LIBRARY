const mongoose = require('mongoose');

const gardenEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seed',
  },
  seedName: {
    type: String,
    required: true,
  },
  varietyName: {
    type: String,
    default: 'Traditional Heirloom',
  },
  plotLocation: {
    type: String,
    default: 'Home Garden Plot',
  },
  plantingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expectedHarvestDate: {
    type: Date,
  },
  actualHarvestDate: {
    type: Date,
  },
  stage: {
    type: String,
    enum: [
      'Seed Planted',
      'Germination',
      'Seedling',
      'Vegetative Growth',
      'Flowering',
      'Harvest Ready',
      'Harvested'
    ],
    default: 'Seed Planted',
  },
  progressPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 10,
  },
  healthStatus: {
    type: String,
    enum: ['Thriving', 'Healthy', 'Needs Water', 'Pest Concern', 'Harvested'],
    default: 'Healthy',
  },
  notes: {
    type: String,
    default: '',
  },
  harvestYieldNotes: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GardenEntry', gardenEntrySchema);


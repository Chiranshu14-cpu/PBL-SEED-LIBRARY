const mongoose = require('mongoose');

const seedDepositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  depositNumber: {
    type: String,
    required: true,
    unique: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  seedName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Herbs', 'Pulses', 'Grains', 'Flowers'],
    required: true,
  },
  quantityPackets: {
    type: Number,
    required: true,
    min: 1,
  },
  weightGrams: {
    type: Number,
    required: true,
    min: 1,
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  seedSource: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  contactDetails: {
    phone: String,
    village: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewNotes: {
    type: String,
    default: '',
  },
  reviewedAt: {
    type: Date,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SeedDeposit', seedDepositSchema);


const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
  seed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seed',
    required: true,
  },
  seedName: {
    type: String,
    required: true,
  },
  borrowedQuantity: {
    type: Number,
    required: true,
  },
  returnedQuantity: {
    type: Number,
    required: true,
  },
  returnedWeightGrams: {
    type: Number,
    default: 0,
  },
  germinationRateReported: {
    type: Number, // Percentage 0 - 100
    default: 85,
  },
  seedQualityRating: {
    type: Number, // 1 to 5
    default: 5,
  },
});

const returnSchema = new mongoose.Schema({
  borrowRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRequest',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  returnNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [returnItemSchema],
  status: {
    type: String,
    enum: ['Pending Verification', 'Verified & Accepted', 'Rejected'],
    default: 'Pending Verification',
  },
  farmerNotes: {
    type: String,
    default: '',
  },
  verificationNotes: {
    type: String,
    default: '',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verifiedAt: {
    type: Date,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  returnDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Return', returnSchema);


const mongoose = require('mongoose');

const borrowItemSchema = new mongoose.Schema({
  seed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seed',
    required: true,
  },
  seedName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  packetWeightGrams: {
    type: Number,
    default: 25,
  },
});

const borrowRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  borrowNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [borrowItemSchema],
  totalQuantity: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    default: 'Seasonal Farming / Village Multiplication',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  issueDate: {
    type: Date,
  },
  returnDueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Borrowed', 'Return Requested', 'Returned', 'Overdue'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);


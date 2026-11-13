const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
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
  pricePerPacket: {
    type: Number,
    required: true,
  },
  packetWeightGrams: {
    type: Number,
    required: true,
  },
  totalItemPrice: {
    type: Number,
    required: true,
  },
  totalItemWeightGrams: {
    type: Number,
    required: true,
  },
});

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [purchaseItemSchema],
  totalQuantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalWeightGrams: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'Village Seed Desk / Cash on Pickup',
  },
  deliveryMethod: {
    type: String,
    default: 'Self-Pickup at Village Library',
  },
  deliveryAddress: {
    villageCity: String,
    district: String,
    state: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['Completed', 'Processing', 'Cancelled'],
    default: 'Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Purchase', purchaseSchema);


const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
    default: 'System',
  },
  userRole: {
    type: String,
    default: 'system',
  },
  activityType: {
    type: String,
    enum: [
      'USER_REGISTRATION',
      'USER_LOGIN',
      'PURCHASE',
      'BORROW_REQUEST',
      'BORROW_APPROVED',
      'BORROW_REJECTED',
      'RETURN_SUBMITTED',
      'RETURN_VERIFIED',
      'SEED_DEPOSITED',
      'SEED_DEPOSIT_APPROVED',
      'SEED_DEPOSIT_REJECTED',
      'STOCK_UPDATE',
      'GARDEN_UPDATE',
      'FEEDBACK_SUBMITTED',
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
  },
  status: {
    type: String,
    default: 'Success',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);


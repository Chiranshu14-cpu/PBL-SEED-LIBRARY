const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  seedQualityRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  platformExperienceRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Feedback text is required'],
  },
  suggestions: {
    type: String,
    default: '',
  },
  adminReply: {
    type: String,
    default: '',
  },
  repliedAt: {
    type: Date,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);


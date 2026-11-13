const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Submit user feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { overallRating, seedQualityRating, platformExperienceRating, comment, suggestions } = req.body;

    if (!overallRating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an overall rating and your feedback comments.',
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      userName: req.user.fullName,
      overallRating: parseInt(overallRating, 10),
      seedQualityRating: parseInt(seedQualityRating || overallRating, 10),
      platformExperienceRating: parseInt(platformExperienceRating || overallRating, 10),
      comment,
      suggestions: suggestions || '',
    });

    // Reward with 15 Guardian points for submitting community feedback!
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { guardianPoints: 15 },
    });

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'FEEDBACK_SUBMITTED',
      description: `Submitted community review (${overallRating}★) for library services`,
      entityId: feedback._id.toString(),
      status: 'Success',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! 15 Guardian Points awarded.',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback submissions (Admin / Librarian)
// @route   GET /api/feedback
// @access  Public / Private
exports.getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'fullName email role villageCity')
      .populate('repliedBy', 'fullName role')
      .sort({ createdAt: -1 });

    // Compute average ratings
    const totalCount = feedbacks.length;
    const avgOverall = totalCount > 0 ? feedbacks.reduce((acc, f) => acc + f.overallRating, 0) / totalCount : 5;
    const avgSeedQuality = totalCount > 0 ? feedbacks.reduce((acc, f) => acc + f.seedQualityRating, 0) / totalCount : 5;
    const avgPlatform = totalCount > 0 ? feedbacks.reduce((acc, f) => acc + f.platformExperienceRating, 0) / totalCount : 5;

    res.status(200).json({
      success: true,
      count: totalCount,
      averages: {
        overall: parseFloat(avgOverall.toFixed(1)),
        seedQuality: parseFloat(avgSeedQuality.toFixed(1)),
        platformExperience: parseFloat(avgPlatform.toFixed(1)),
      },
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin reply to feedback
// @route   PUT /api/feedback/:id/reply
// @access  Private (Admin)
exports.replyFeedback = async (req, res, next) => {
  try {
    const { adminReply } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.',
      });
    }

    feedback.adminReply = adminReply;
    feedback.repliedBy = req.user._id;
    feedback.repliedAt = new Date();
    await feedback.save();

    // Notify user
    await Notification.create({
      user: feedback.user,
      title: 'Response to Your Feedback 💬',
      message: `The Seed Vault administration responded to your feedback: "${adminReply}"`,
      type: 'general',
      link: '/feedback',
    });

    res.status(200).json({
      success: true,
      message: 'Reply posted successfully.',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};


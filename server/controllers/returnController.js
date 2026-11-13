const Return = require('../models/Return');
const BorrowRequest = require('../models/BorrowRequest');
const Seed = require('../models/Seed');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Farmer submits a return request for borrowed seeds
// @route   POST /api/returns
// @access  Private (Farmer, Admin, Librarian)
exports.submitReturn = async (req, res, next) => {
  try {
    const { borrowRequestId, items, farmerNotes } = req.body;

    const borrow = await BorrowRequest.findById(borrowRequestId);
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Associated borrow record not found.',
      });
    }

    if (borrow.user.toString() !== req.user._id.toString() && req.user.role === 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only return seeds you have personally borrowed.',
      });
    }

    if (borrow.status !== 'Borrowed' && borrow.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: `Cannot initiate return for record with status '${borrow.status}'. Only active borrowed seeds can be returned.`,
      });
    }

    const returnNumber = `SV-RET-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const returnDoc = await Return.create({
      borrowRequest: borrow._id,
      user: req.user._id,
      returnNumber,
      items: items.map(item => ({
        seed: item.seed,
        seedName: item.seedName,
        borrowedQuantity: item.borrowedQuantity,
        returnedQuantity: parseInt(item.returnedQuantity, 10),
        returnedWeightGrams: parseFloat(item.returnedWeightGrams || 0),
        germinationRateReported: parseFloat(item.germinationRateReported || 85),
        seedQualityRating: parseInt(item.seedQualityRating || 5, 10),
      })),
      farmerNotes: farmerNotes || '',
      status: 'Pending Verification',
      returnDate: new Date(),
    });

    // Update borrow request status to 'Return Requested'
    borrow.status = 'Return Requested';
    await borrow.save();

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: 'Return Request Logged 🌾',
      message: `Return submission #${returnNumber} has been recorded. Once the librarian inspects seed quality and verifies the batch, points will be credited to your account!`,
      type: 'return',
      link: '/returns',
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'RETURN_SUBMITTED',
      description: `Submitted seed return request #${returnNumber} for borrow record #${borrow.borrowNumber}`,
      entityId: returnDoc._id.toString(),
      status: 'Pending Verification',
    });

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully! Awaiting librarian physical verification.',
      returnDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get returns list
// @route   GET /api/returns
// @access  Private
exports.getReturns = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'farmer') {
      query.user = req.user._id;
    }

    const returns = await Return.find(query)
      .populate('user', 'fullName email phone villageCity')
      .populate('borrowRequest', 'borrowNumber requestDate returnDueDate')
      .populate('verifiedBy', 'fullName role')
      .sort({ returnDate: -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Librarian or Admin verifies and accepts/rejects a seed return
// @route   PUT /api/returns/:id/verify
// @access  Private (Librarian, Admin)
exports.verifyReturn = async (req, res, next) => {
  try {
    const { status, verificationNotes, pointsToAward = 30 } = req.body;
    const returnDoc = await Return.findById(req.params.id)
      .populate('borrowRequest')
      .populate('user');

    if (!returnDoc) {
      return res.status(404).json({
        success: false,
        message: 'Return record not found.',
      });
    }

    if (returnDoc.status !== 'Pending Verification') {
      return res.status(400).json({
        success: false,
        message: `This return record has already been processed with status '${returnDoc.status}'.`,
      });
    }

    if (status === 'Verified & Accepted') {
      // 1. Update available stock in Seed documents
      for (const item of returnDoc.items) {
        await Seed.findByIdAndUpdate(item.seed, {
          $inc: {
            availableStock: item.returnedQuantity,
            totalReturned: item.returnedQuantity,
          },
        });
      }

      // 2. Mark borrow request as Returned
      if (returnDoc.borrowRequest) {
        await BorrowRequest.findByIdAndUpdate(returnDoc.borrowRequest._id, {
          status: 'Returned',
        });
      }

      // 3. Award Guardian points to the farmer
      const points = parseInt(pointsToAward, 10) || 30;
      await User.findByIdAndUpdate(returnDoc.user._id, {
        $inc: { guardianPoints: points },
        $addToSet: {
          badges: {
            id: 'guardian_returner',
            title: 'Guardian of Seeds',
            icon: 'Award',
            description: 'Returned viable harvested seeds to the village library',
          },
        },
      });

      returnDoc.status = 'Verified & Accepted';
      returnDoc.pointsAwarded = points;
      returnDoc.verificationNotes = verificationNotes || 'Seeds verified for physical purity, germination rate, and viability.';
      returnDoc.verifiedBy = req.user._id;
      returnDoc.verifiedAt = new Date();
      await returnDoc.save();

      // Notify farmer
      await Notification.create({
        user: returnDoc.user._id,
        title: 'Return Verified & Accepted! 🏆',
        message: `Your seed return #${returnDoc.returnNumber} has been verified by ${req.user.fullName}. You have been awarded ${points} Seed Guardian Points!`,
        type: 'points',
        link: '/points',
      });

      // Log Activity
      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        activityType: 'RETURN_VERIFIED',
        description: `Verified and accepted return #${returnDoc.returnNumber}. Restocked inventory and awarded ${points} points to ${returnDoc.user.fullName}`,
        entityId: returnDoc._id.toString(),
        status: 'Success',
      });
    } else if (status === 'Rejected') {
      returnDoc.status = 'Rejected';
      returnDoc.verificationNotes = verificationNotes || 'Seeds did not meet minimum library purity or viability standards.';
      returnDoc.verifiedBy = req.user._id;
      returnDoc.verifiedAt = new Date();
      await returnDoc.save();

      await Notification.create({
        user: returnDoc.user._id,
        title: 'Seed Return Update',
        message: `Your seed return #${returnDoc.returnNumber} could not be accepted. Note: ${returnDoc.verificationNotes}`,
        type: 'return',
      });

      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        activityType: 'RETURN_VERIFIED',
        description: `Rejected return #${returnDoc.returnNumber}: ${returnDoc.verificationNotes}`,
        entityId: returnDoc._id.toString(),
        status: 'Rejected',
      });
    }

    res.status(200).json({
      success: true,
      message: `Return request ${returnDoc.status}.`,
      returnDoc,
    });
  } catch (error) {
    next(error);
  }
};


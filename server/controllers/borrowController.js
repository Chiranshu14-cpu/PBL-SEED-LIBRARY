const BorrowRequest = require('../models/BorrowRequest');
const Seed = require('../models/Seed');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create a new borrow request
// @route   POST /api/borrows
// @access  Private (Farmer, Admin, Librarian)
exports.createBorrowRequest = async (req, res, next) => {
  try {
    const { items, purpose } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please select seed packets to borrow.',
      });
    }

    let totalQuantity = 0;
    const validatedItems = [];

    for (const item of items) {
      const seedDoc = await Seed.findById(item.seedId || item.seed);
      if (!seedDoc) {
        return res.status(404).json({
          success: false,
          message: `Seed variety ${item.seedName || 'item'} not found.`,
        });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for seed ${seedDoc.name}.`,
        });
      }

      // Check available stock
      if (seedDoc.availableStock < qty) {
        return res.status(400).json({
          success: false,
          message: `Cannot borrow ${qty} packets of ${seedDoc.name}. Available library stock is only ${seedDoc.availableStock}.`,
        });
      }

      totalQuantity += qty;
      validatedItems.push({
        seed: seedDoc._id,
        seedName: seedDoc.name,
        quantity: qty,
        packetWeightGrams: seedDoc.packetWeightGrams || 25,
      });
    }

    const borrowNumber = `SV-BOR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const borrowRequest = await BorrowRequest.create({
      user: req.user._id,
      borrowNumber,
      items: validatedItems,
      totalQuantity,
      purpose: purpose || 'Traditional Farm Multiplication & Community Return',
      status: 'Pending',
      requestDate: new Date(),
    });

    // Notify user
    await Notification.create({
      user: req.user._id,
      title: 'Borrow Request Submitted 📋',
      message: `Your seed borrowing request #${borrowNumber} for ${totalQuantity} packets has been submitted to the village librarian for approval.`,
      type: 'borrow',
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'BORROW_REQUEST',
      description: `Submitted borrowing request #${borrowNumber} for ${totalQuantity} seed packets`,
      entityId: borrowRequest._id.toString(),
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Borrow request submitted successfully! Awaiting librarian approval.',
      borrowRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own borrow requests
// @route   GET /api/borrows/my
// @access  Private
exports.getMyBorrows = async (req, res, next) => {
  try {
    const borrows = await BorrowRequest.find({ user: req.user._id })
      .populate('items.seed', 'name imageUrl category scientificName growingSeason')
      .populate('reviewedBy', 'fullName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all borrow requests (Admin / Librarian)
// @route   GET /api/borrows
// @access  Private (Admin / Librarian)
exports.getAllBorrows = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const borrows = await BorrowRequest.find(filter)
      .populate('user', 'fullName email phone villageCity district state')
      .populate('items.seed', 'name category availableStock')
      .populate('reviewedBy', 'fullName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update borrow request status (Approve / Reject / Issue)
// @route   PUT /api/borrows/:id/status
// @access  Private (Admin / Librarian)
exports.updateBorrowStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes, dueDateDays = 90 } = req.body;
    const borrow = await BorrowRequest.findById(req.params.id).populate('items.seed');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow request not found.',
      });
    }

    if (!['Approved', 'Rejected', 'Borrowed', 'Returned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition: ${status}`,
      });
    }

    const prevStatus = borrow.status;

    // When approving / issuing seeds
    if ((status === 'Approved' || status === 'Borrowed') && prevStatus === 'Pending') {
      // Re-verify stock availability before deducting
      for (const item of borrow.items) {
        const seedDoc = await Seed.findById(item.seed._id || item.seed);
        if (!seedDoc || seedDoc.availableStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot approve request: Insufficient stock for ${item.seedName}. Only ${seedDoc ? seedDoc.availableStock : 0} packets remaining.`,
          });
        }
      }

      // Deduct available stock and increment totalBorrowed
      for (const item of borrow.items) {
        await Seed.findByIdAndUpdate(item.seed._id || item.seed, {
          $inc: {
            availableStock: -item.quantity,
            totalBorrowed: item.quantity,
          },
        });
      }

      borrow.issueDate = new Date();
      // Set return due date (default 90 days for seasonal multiplication)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(dueDateDays, 10));
      borrow.returnDueDate = dueDate;
      borrow.status = 'Borrowed'; // Transition directly to active Borrowed state
    } else if (status === 'Rejected') {
      borrow.status = 'Rejected';
    } else {
      borrow.status = status;
    }

    borrow.reviewedBy = req.user._id;
    borrow.reviewNotes = reviewNotes || '';
    borrow.reviewedAt = new Date();
    await borrow.save();

    // Create Notification for user
    const isApproved = borrow.status === 'Borrowed' || borrow.status === 'Approved';
    await Notification.create({
      user: borrow.user,
      title: isApproved ? 'Seed Borrowing Approved! 🌱' : 'Borrow Request Update',
      message: isApproved
        ? `Your borrow request #${borrow.borrowNumber} has been approved and issued! Return due date is ${new Date(borrow.returnDueDate).toLocaleDateString()}. Please remember to return seeds after your harvest.`
        : `Your borrow request #${borrow.borrowNumber} was rejected. Note: ${reviewNotes || 'Contact the library desk.'}`,
      type: 'borrow',
      link: '/borrows',
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: isApproved ? 'BORROW_APPROVED' : 'BORROW_REJECTED',
      description: `${req.user.fullName} (${req.user.role}) marked borrow #${borrow.borrowNumber} as ${borrow.status}`,
      entityId: borrow._id.toString(),
      status: borrow.status,
    });

    res.status(200).json({
      success: true,
      message: `Borrow request updated to ${borrow.status}.`,
      borrow,
    });
  } catch (error) {
    next(error);
  }
};


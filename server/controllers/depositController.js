const SeedDeposit = require('../models/SeedDeposit');
const Seed = require('../models/Seed');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Submit a community seed deposit request
// @route   POST /api/deposits
// @access  Private (Farmer, Admin, Librarian)
exports.createDeposit = async (req, res, next) => {
  try {
    const {
      farmerName,
      seedName,
      category,
      quantityPackets,
      weightGrams,
      harvestDate,
      seedSource,
      description,
      contactPhone,
      villageLocation,
    } = req.body;

    if (!seedName || !category || !quantityPackets || !weightGrams || !harvestDate || !seedSource) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required seed deposit details.',
      });
    }

    const depositNumber = `SV-DEP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const deposit = await SeedDeposit.create({
      user: req.user._id,
      depositNumber,
      farmerName: farmerName || req.user.fullName,
      seedName,
      category,
      quantityPackets: parseInt(quantityPackets, 10),
      weightGrams: parseFloat(weightGrams),
      harvestDate: new Date(harvestDate),
      seedSource,
      description: description || '',
      contactDetails: {
        phone: contactPhone || req.user.phone,
        village: villageLocation || req.user.villageCity,
      },
      status: 'Pending',
    });

    // Notify user
    await Notification.create({
      user: req.user._id,
      title: 'Community Deposit Submitted 🌱',
      message: `Your seed deposit #${depositNumber} for '${seedName}' (${quantityPackets} packets) is submitted for library review. Thank you for preserving agricultural heritage!`,
      type: 'deposit',
      link: '/deposits',
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'SEED_DEPOSITED',
      description: `Contributed community deposit #${depositNumber}: ${quantityPackets} packets of ${seedName} (${weightGrams}g)`,
      entityId: deposit._id.toString(),
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Seed deposit request submitted successfully!',
      deposit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own deposits
// @route   GET /api/deposits/my
// @access  Private
exports.getMyDeposits = async (req, res, next) => {
  try {
    const deposits = await SeedDeposit.find({ user: req.user._id })
      .populate('reviewedBy', 'fullName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all deposits (Admin / Librarian)
// @route   GET /api/deposits
// @access  Private (Admin / Librarian)
exports.getAllDeposits = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const deposits = await SeedDeposit.find(filter)
      .populate('user', 'fullName email phone villageCity')
      .populate('reviewedBy', 'fullName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review and approve/reject a seed deposit (Admin / Librarian)
// @route   PUT /api/deposits/:id/review
// @access  Private (Admin / Librarian)
exports.reviewDeposit = async (req, res, next) => {
  try {
    const { status, reviewNotes, pointsToAward = 50, linkToExistingSeedId } = req.body;
    const deposit = await SeedDeposit.findById(req.params.id).populate('user');

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: 'Deposit record not found.',
      });
    }

    if (deposit.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This deposit has already been processed with status '${deposit.status}'.`,
      });
    }

    if (status === 'Approved') {
      // 1. If an existing seed matches, update inventory or create new entry
      let targetSeed;
      if (linkToExistingSeedId) {
        targetSeed = await Seed.findById(linkToExistingSeedId);
      } else {
        // Find by name match
        targetSeed = await Seed.findOne({
          name: { $regex: new RegExp(`^${deposit.seedName.trim()}$`, 'i') },
        });
      }

      if (targetSeed) {
        // Increase availableStock and totalDeposited
        targetSeed.availableStock += deposit.quantityPackets;
        targetSeed.totalDeposited = (targetSeed.totalDeposited || 0) + deposit.quantityPackets;
        await targetSeed.save();
      } else {
        // Create new seed entry in library catalog!
        await Seed.create({
          name: deposit.seedName,
          vernacularNames: {
            en: deposit.seedName,
            hi: deposit.seedName,
            mr: deposit.seedName,
          },
          scientificName: `${deposit.seedName} indigenous sp.`,
          category: deposit.category,
          description: {
            en: deposit.description || `Community heritage seed contributed by ${deposit.farmerName}. Source: ${deposit.seedSource}`,
            hi: `सामुदायिक बीज ${deposit.farmerName} द्वारा संरक्षित।`,
            mr: `${deposit.farmerName} यांनी जतन केलेले देशी बियाणे.`,
          },
          packetWeightGrams: Math.round(deposit.weightGrams / deposit.quantityPackets) || 25,
          packetWeightDisplay: `${Math.round(deposit.weightGrams / deposit.quantityPackets) || 25}g`,
          pricePerPacket: 15, // Nominal community price
          initialStock: deposit.quantityPackets,
          availableStock: deposit.quantityPackets,
          totalDeposited: deposit.quantityPackets,
          growingSeason: 'Kharif / Rabi',
          germinationPeriod: '7 - 12 Days',
          harvestPeriod: '75 - 90 Days',
          sunlight: 'Full Sun',
          soilRequirements: 'Compost rich loamy soil',
          watering: 'Moderate',
          imageUrl: '',
          isHeritageVariety: true,
        });
      }

      // 2. Award Guardian points to contributing farmer
      const points = parseInt(pointsToAward, 10) || 50;
      await User.findByIdAndUpdate(deposit.user._id, {
        $inc: { guardianPoints: points },
        $addToSet: {
          badges: {
            id: 'heritage_depositor',
            title: 'Heritage Preserver',
            icon: 'Crown',
            description: 'Contributed heirloom seed varieties to the community bank',
          },
        },
      });

      deposit.status = 'Approved';
      deposit.pointsAwarded = points;
      deposit.reviewedBy = req.user._id;
      deposit.reviewNotes = reviewNotes || 'Seed viability confirmed. Added to library stock.';
      deposit.reviewedAt = new Date();
      await deposit.save();

      // Notify farmer
      await Notification.create({
        user: deposit.user._id,
        title: 'Seed Deposit Approved! 🌟',
        message: `Your deposit #${deposit.depositNumber} for '${deposit.seedName}' was verified and added to the Seed Vault! You earned ${points} Guardian Points!`,
        type: 'points',
        link: '/points',
      });

      // Log Activity
      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        activityType: 'SEED_DEPOSIT_APPROVED',
        description: `Approved deposit #${deposit.depositNumber} (${deposit.quantityPackets} packets of ${deposit.seedName}) by ${deposit.farmerName}. Awarded ${points} points.`,
        entityId: deposit._id.toString(),
        status: 'Approved',
      });
    } else if (status === 'Rejected') {
      deposit.status = 'Rejected';
      deposit.reviewedBy = req.user._id;
      deposit.reviewNotes = reviewNotes || 'Seeds did not meet seed library purity specifications.';
      deposit.reviewedAt = new Date();
      await deposit.save();

      await Notification.create({
        user: deposit.user._id,
        title: 'Seed Deposit Update',
        message: `Your seed deposit #${deposit.depositNumber} for '${deposit.seedName}' could not be accepted. Note: ${deposit.reviewNotes}`,
        type: 'deposit',
      });

      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        activityType: 'SEED_DEPOSIT_REJECTED',
        description: `Rejected deposit #${deposit.depositNumber} (${deposit.seedName}): ${deposit.reviewNotes}`,
        entityId: deposit._id.toString(),
        status: 'Rejected',
      });
    }

    res.status(200).json({
      success: true,
      message: `Deposit request marked as ${deposit.status}.`,
      deposit,
    });
  } catch (error) {
    next(error);
  }
};


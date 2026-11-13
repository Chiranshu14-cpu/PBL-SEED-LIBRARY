const User = require('../models/User');
const Seed = require('../models/Seed');
const Purchase = require('../models/Purchase');
const BorrowRequest = require('../models/BorrowRequest');
const Return = require('../models/Return');
const SeedDeposit = require('../models/SeedDeposit');
const GardenEntry = require('../models/GardenEntry');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalLibrarians = await User.countDocuments({ role: 'librarian' });

    const seeds = await Seed.find();
    const totalVarieties = seeds.length;

    let totalAvailablePackets = 0;
    let totalPurchasedPackets = 0;
    let totalBorrowedPackets = 0;
    let lowStockCount = 0;
    let totalSeedWeightGrams = 0;

    const lowStockAlerts = [];

    seeds.forEach((s) => {
      totalAvailablePackets += s.availableStock || 0;
      totalPurchasedPackets += s.totalPurchased || 0;
      totalBorrowedPackets += s.totalBorrowed || 0;
      totalSeedWeightGrams += (s.availableStock || 0) * (s.packetWeightGrams || 25);

      if (s.availableStock <= (s.lowStockThreshold || 15)) {
        lowStockCount += 1;
        lowStockAlerts.push({
          _id: s._id,
          name: s.name,
          category: s.category,
          availableStock: s.availableStock,
          threshold: s.lowStockThreshold || 15,
        });
      }
    });

    const totalDeposits = await SeedDeposit.countDocuments();
    const pendingBorrows = await BorrowRequest.countDocuments({ status: 'Pending' });
    const pendingReturns = await Return.countDocuments({ status: 'Pending Verification' });
    const pendingDeposits = await SeedDeposit.countDocuments({ status: 'Pending' });
    const totalPendingApprovals = pendingBorrows + pendingReturns + pendingDeposits;

    // Recent Transactions (Purchases & Borrows)
    const recentPurchases = await Purchase.find()
      .populate('user', 'fullName villageCity')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBorrows = await BorrowRequest.find()
      .populate('user', 'fullName villageCity')
      .sort({ createdAt: -1 })
      .limit(5);

    // Activity Logs
    const recentActivities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(10);

    // Category Distribution
    const categoryDistribution = await Seed.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stock: { $sum: '$availableStock' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalFarmers,
        totalLibrarians,
        totalVarieties,
        totalAvailablePackets,
        totalPurchasedPackets,
        totalBorrowedPackets,
        totalDeposits,
        totalPendingApprovals,
        pendingBorrows,
        pendingReturns,
        pendingDeposits,
        lowStockCount,
        totalSeedWeightKg: parseFloat((totalSeedWeightGrams / 1000).toFixed(2)),
      },
      lowStockAlerts,
      recentPurchases,
      recentBorrows,
      recentActivities,
      categoryDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Seed Librarian Dashboard Stats
// @route   GET /api/dashboard/librarian
// @access  Private (Librarian, Admin)
exports.getLibrarianDashboard = async (req, res, next) => {
  try {
    const seeds = await Seed.find();
    let totalAvailableInventory = 0;
    const lowStockAlerts = [];

    seeds.forEach((s) => {
      totalAvailableInventory += s.availableStock || 0;
      if (s.availableStock <= (s.lowStockThreshold || 15)) {
        lowStockAlerts.push({
          _id: s._id,
          name: s.name,
          category: s.category,
          availableStock: s.availableStock,
          threshold: s.lowStockThreshold || 15,
        });
      }
    });

    const pendingBorrows = await BorrowRequest.find({ status: 'Pending' })
      .populate('user', 'fullName phone villageCity')
      .sort({ createdAt: -1 });

    const pendingReturns = await Return.find({ status: 'Pending Verification' })
      .populate('user', 'fullName phone villageCity')
      .populate('borrowRequest', 'borrowNumber')
      .sort({ returnDate: -1 });

    const pendingDeposits = await SeedDeposit.find({ status: 'Pending' })
      .populate('user', 'fullName phone villageCity')
      .sort({ createdAt: -1 });

    const recentStockChanges = await ActivityLog.find({
      activityType: { $in: ['STOCK_UPDATE', 'PURCHASE', 'BORROW_APPROVED', 'RETURN_VERIFIED', 'SEED_DEPOSIT_APPROVED'] }
    })
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalAvailableInventory,
        pendingBorrowsCount: pendingBorrows.length,
        pendingReturnsCount: pendingReturns.length,
        pendingDepositsCount: pendingDeposits.length,
        lowStockCount: lowStockAlerts.length,
      },
      lowStockAlerts,
      pendingBorrows,
      pendingReturns,
      pendingDeposits,
      recentStockChanges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Farmer Dashboard Stats
// @route   GET /api/dashboard/farmer
// @access  Private
exports.getFarmerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const totalPurchases = await Purchase.countDocuments({ user: userId });
    const myBorrows = await BorrowRequest.find({
      user: userId,
      status: { $in: ['Borrowed', 'Approved', 'Return Requested'] }
    }).populate('items.seed', 'name imageUrl category');

    const gardenPlants = await GardenEntry.find({ user: userId }).sort({ updatedAt: -1 });

    const recentActivities = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(5);

    // Upcoming return due dates
    const dueDates = myBorrows
      .filter((b) => b.returnDueDate)
      .map((b) => ({
        borrowNumber: b.borrowNumber,
        returnDueDate: b.returnDueDate,
        items: b.items.map((i) => i.seedName).join(', '),
        daysRemaining: Math.ceil((new Date(b.returnDueDate) - new Date()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => new Date(a.returnDueDate) - new Date(b.returnDueDate));

    // Recommended Seeds (e.g. In-stock popular seasonal varieties)
    const recommendedSeeds = await Seed.find({ availableStock: { $gt: 5 } })
      .select('name scientificName category pricePerPacket availableStock imageUrl packetWeightDisplay growingSeason')
      .limit(4);

    res.status(200).json({
      success: true,
      farmer: {
        fullName: user.fullName,
        villageCity: user.villageCity,
        district: user.district,
        guardianPoints: user.guardianPoints,
        badges: user.badges || [],
      },
      counts: {
        purchases: totalPurchases,
        activeBorrows: myBorrows.length,
        gardenPlants: gardenPlants.length,
      },
      activeBorrows: myBorrows,
      dueDates,
      gardenPlants: gardenPlants.slice(0, 4),
      recentActivities,
      recommendedSeeds,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global activity logs (for Activity History Page)
// @route   GET /api/dashboard/activity-logs
// @access  Private
exports.getActivityLogs = async (req, res, next) => {
  try {
    const { type, limit = 50 } = req.query;
    let query = {};
    if (type && type !== 'All') {
      query.activityType = type;
    }

    // Farmers see their own or public activities; Admins/Librarians see all
    if (req.user.role === 'farmer') {
      query.$or = [{ user: req.user._id }, { user: null }];
    }

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    next(error);
  }
};


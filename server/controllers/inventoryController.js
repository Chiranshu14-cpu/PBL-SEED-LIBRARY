const Seed = require('../models/Seed');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get aggregate inventory summary and full seed table
// @route   GET /api/inventory
// @access  Private (Admin / Librarian)
exports.getInventoryStats = async (req, res, next) => {
  try {
    const seeds = await Seed.find().sort({ name: 1 });

    let totalInitialStock = 0;
    let totalAvailableStock = 0;
    let totalPurchasedPackets = 0;
    let totalBorrowedPackets = 0;
    let totalReturnedPackets = 0;
    let totalDepositedPackets = 0;
    let totalSeedWeightKg = 0;
    let lowStockCount = 0;

    const inventoryList = seeds.map((s) => {
      totalInitialStock += s.initialStock || 0;
      totalAvailableStock += s.availableStock || 0;
      totalPurchasedPackets += s.totalPurchased || 0;
      totalBorrowedPackets += s.totalBorrowed || 0;
      totalReturnedPackets += s.totalReturned || 0;
      totalDepositedPackets += s.totalDeposited || 0;

      const weightForThisSeedKg = ((s.availableStock || 0) * (s.packetWeightGrams || 25)) / 1000;
      totalSeedWeightKg += weightForThisSeedKg;

      const isLowStock = s.availableStock <= (s.lowStockThreshold || 15);
      if (isLowStock) lowStockCount += 1;

      let status = 'In Stock';
      if (s.availableStock <= 0) {
        status = 'Out of Stock';
      } else if (isLowStock) {
        status = 'Low Stock Alert';
      }

      return {
        _id: s._id,
        name: s.name,
        category: s.category,
        scientificName: s.scientificName,
        packetWeightGrams: s.packetWeightGrams,
        packetWeightDisplay: s.packetWeightDisplay,
        pricePerPacket: s.pricePerPacket,
        initialStock: s.initialStock,
        availableStock: s.availableStock,
        totalPurchased: s.totalPurchased || 0,
        totalBorrowed: s.totalBorrowed || 0,
        totalReturned: s.totalReturned || 0,
        totalDeposited: s.totalDeposited || 0,
        lowStockThreshold: s.lowStockThreshold || 15,
        status,
        updatedAt: s.updatedAt || s.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      summary: {
        totalVarieties: seeds.length,
        totalInitialStock,
        totalAvailableStock,
        totalPurchasedPackets,
        totalBorrowedPackets,
        totalReturnedPackets,
        totalDepositedPackets,
        totalSeedWeightKg: parseFloat(totalSeedWeightKg.toFixed(2)),
        lowStockCount,
      },
      inventory: inventoryList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick adjust stock for a seed variety (Admin / Librarian)
// @route   PUT /api/inventory/:id/stock
// @access  Private (Admin / Librarian)
exports.adjustStock = async (req, res, next) => {
  try {
    const { availableStock, initialStock, lowStockThreshold, adjustmentReason } = req.body;
    const seed = await Seed.findById(req.params.id);

    if (!seed) {
      return res.status(404).json({
        success: false,
        message: 'Seed variety not found.',
      });
    }

    const oldAvailable = seed.availableStock;
    if (availableStock !== undefined) seed.availableStock = parseInt(availableStock, 10);
    if (initialStock !== undefined) seed.initialStock = parseInt(initialStock, 10);
    if (lowStockThreshold !== undefined) seed.lowStockThreshold = parseInt(lowStockThreshold, 10);

    await seed.save();

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'STOCK_UPDATE',
      description: `Manual stock adjustment for ${seed.name}: Available changed from ${oldAvailable} to ${seed.availableStock}. Reason: ${adjustmentReason || 'Routine inventory verification'}`,
      entityId: seed._id.toString(),
      status: 'Success',
    });

    res.status(200).json({
      success: true,
      message: `Stock updated for ${seed.name}.`,
      seed,
    });
  } catch (error) {
    next(error);
  }
};


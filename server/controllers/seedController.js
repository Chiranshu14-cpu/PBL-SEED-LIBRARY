const Seed = require('../models/Seed');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all seeds with search, filter, and sort
// @route   GET /api/seeds
// @access  Public
exports.getAllSeeds = async (req, res, next) => {
  try {
    const { category, search, availability, sort } = req.query;
    let query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by Name or Botanical Name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { 'vernacularNames.hi': { $regex: search, $options: 'i' } },
        { 'vernacularNames.mr': { $regex: search, $options: 'i' } },
      ];
    }

    // Availability Filter
    if (availability === 'inStock') {
      query.availableStock = { $gt: 0 };
    } else if (availability === 'lowStock') {
      query.availableStock = { $gt: 0, $lte: 15 };
    } else if (availability === 'outOfStock') {
      query.availableStock = { $lte: 0 };
    }

    // Sorting
    let sortOption = { name: 1 };
    if (sort === 'priceLow') sortOption = { pricePerPacket: 1 };
    else if (sort === 'priceHigh') sortOption = { pricePerPacket: -1 };
    else if (sort === 'nameDesc') sortOption = { name: -1 };
    else if (sort === 'stockHigh') sortOption = { availableStock: -1 };

    const seeds = await Seed.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: seeds.length,
      seeds,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single seed by ID
// @route   GET /api/seeds/:id
// @access  Public
exports.getSeedById = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.id);
    if (!seed) {
      return res.status(404).json({
        success: false,
        message: 'Seed variety not found.',
      });
    }

    res.status(200).json({
      success: true,
      seed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new seed variety (Admin)
// @route   POST /api/seeds
// @access  Private (Admin)
exports.createSeed = async (req, res, next) => {
  try {
    const seed = await Seed.create(req.body);

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'STOCK_UPDATE',
      description: `Added new seed variety: ${seed.name} (${seed.category}) with initial stock of ${seed.initialStock} packets`,
      entityId: seed._id.toString(),
      status: 'Success',
    });

    res.status(201).json({
      success: true,
      message: 'New seed variety registered successfully!',
      seed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seed variety (Admin / Librarian)
// @route   PUT /api/seeds/:id
// @access  Private (Admin / Librarian)
exports.updateSeed = async (req, res, next) => {
  try {
    let seed = await Seed.findById(req.params.id);
    if (!seed) {
      return res.status(404).json({
        success: false,
        message: 'Seed variety not found.',
      });
    }

    const prevStock = seed.availableStock;
    seed = await Seed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.availableStock !== undefined && req.body.availableStock !== prevStock) {
      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        activityType: 'STOCK_UPDATE',
        description: `Updated stock for ${seed.name} from ${prevStock} to ${seed.availableStock} packets`,
        entityId: seed._id.toString(),
        status: 'Success',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seed variety updated successfully!',
      seed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete seed variety (Admin)
// @route   DELETE /api/seeds/:id
// @access  Private (Admin)
exports.deleteSeed = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.id);
    if (!seed) {
      return res.status(404).json({
        success: false,
        message: 'Seed variety not found.',
      });
    }

    await seed.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'STOCK_UPDATE',
      description: `Removed seed variety: ${seed.name}`,
      entityId: req.params.id,
      status: 'Success',
    });

    res.status(200).json({
      success: true,
      message: `Seed variety ${seed.name} removed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category counts and summary
// @route   GET /api/seeds/meta/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = ['Vegetables', 'Herbs', 'Pulses', 'Grains', 'Flowers'];
    const summary = await Promise.all(
      categories.map(async (cat) => {
        const count = await Seed.countDocuments({ category: cat });
        const stockAgg = await Seed.aggregate([
          { $match: { category: cat } },
          { $group: { _id: null, totalStock: { $sum: '$availableStock' } } }
        ]);
        return {
          name: cat,
          varietiesCount: count,
          availableStock: stockAgg[0]?.totalStock || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: summary,
    });
  } catch (error) {
    next(error);
  }
};


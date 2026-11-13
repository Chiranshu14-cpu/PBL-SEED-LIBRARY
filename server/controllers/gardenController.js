const GardenEntry = require('../models/GardenEntry');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

const STAGE_PROGRESS_MAP = {
  'Seed Planted': 10,
  'Germination': 25,
  'Seedling': 40,
  'Vegetative Growth': 60,
  'Flowering': 75,
  'Harvest Ready': 90,
  'Harvested': 100,
};

// @desc    Get user's garden entries
// @route   GET /api/garden
// @access  Private
exports.getGarden = async (req, res, next) => {
  try {
    const plants = await GardenEntry.find({ user: req.user._id })
      .populate('seed', 'name imageUrl category scientificName growingSeason harvestPeriod')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: plants.length,
      plants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new plant to personal garden
// @route   POST /api/garden
// @access  Private
exports.addPlant = async (req, res, next) => {
  try {
    const {
      seedId,
      seedName,
      varietyName,
      plotLocation,
      plantingDate,
      expectedHarvestDate,
      stage = 'Seed Planted',
      healthStatus = 'Healthy',
      notes,
    } = req.body;

    if (!seedName) {
      return res.status(400).json({
        success: false,
        message: 'Seed name is required to log a garden entry.',
      });
    }

    const progressPercent = STAGE_PROGRESS_MAP[stage] || 10;

    const plant = await GardenEntry.create({
      user: req.user._id,
      seed: seedId || null,
      seedName,
      varietyName: varietyName || 'Traditional Heirloom',
      plotLocation: plotLocation || 'Home Garden Plot',
      plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
      expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
      stage,
      progressPercent,
      healthStatus,
      notes: notes || '',
    });

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'GARDEN_UPDATE',
      description: `Planted new variety '${seedName}' in garden (${plotLocation || 'Home Plot'})`,
      entityId: plant._id.toString(),
      status: 'Success',
    });

    res.status(201).json({
      success: true,
      message: `${seedName} added to your garden tracker! 🌱`,
      plant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update plant progress, growth stage, or harvest notes
// @route   PUT /api/garden/:id
// @access  Private
exports.updatePlantProgress = async (req, res, next) => {
  try {
    const { stage, healthStatus, notes, harvestYieldNotes, actualHarvestDate, progressPercent } = req.body;

    const plant = await GardenEntry.findOne({ _id: req.params.id, user: req.user._id });
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Garden entry not found.',
      });
    }

    if (stage) {
      plant.stage = stage;
      plant.progressPercent = STAGE_PROGRESS_MAP[stage] !== undefined ? STAGE_PROGRESS_MAP[stage] : plant.progressPercent;
    }
    if (progressPercent !== undefined) plant.progressPercent = progressPercent;
    if (healthStatus) plant.healthStatus = healthStatus;
    if (notes !== undefined) plant.notes = notes;
    if (harvestYieldNotes !== undefined) plant.harvestYieldNotes = harvestYieldNotes;
    if (actualHarvestDate) plant.actualHarvestDate = new Date(actualHarvestDate);

    // If marked harvested, award bonus points
    if (stage === 'Harvested' && plant.stage !== 'Harvested') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { guardianPoints: 20 },
      });
    }

    plant.updatedAt = new Date();
    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Garden plant updated successfully!',
      plant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a plant from garden
// @route   DELETE /api/garden/:id
// @access  Private
exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await GardenEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Garden entry not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `${plant.seedName} removed from garden records.`,
    });
  } catch (error) {
    next(error);
  }
};


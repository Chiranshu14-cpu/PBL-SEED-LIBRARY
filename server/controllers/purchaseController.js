const Purchase = require('../models/Purchase');
const Seed = require('../models/Seed');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Process a simulated seed purchase checkout
// @route   POST /api/purchases
// @access  Private (Farmer, Admin, Librarian)
exports.createPurchase = async (req, res, next) => {
  try {
    const { items, paymentMethod, deliveryMethod, deliveryAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add seed packets to purchase.',
      });
    }

    let calculatedTotalPrice = 0;
    let calculatedTotalWeightGrams = 0;
    let calculatedTotalQuantity = 0;
    const validatedItems = [];

    // Step 1: Validate stock and calculate totals
    for (const item of items) {
      const seedDoc = await Seed.findById(item.seedId || item.seed);
      if (!seedDoc) {
        return res.status(404).json({
          success: false,
          message: `Seed variety ${item.seedName || 'item'} not found in library.`,
        });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for seed ${seedDoc.name}.`,
        });
      }

      if (seedDoc.availableStock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${seedDoc.name}. Only ${seedDoc.availableStock} packets available, but ${qty} requested.`,
        });
      }

      const itemTotalPrice = seedDoc.pricePerPacket * qty;
      const itemTotalWeight = (seedDoc.packetWeightGrams || 25) * qty;

      calculatedTotalPrice += itemTotalPrice;
      calculatedTotalWeightGrams += itemTotalWeight;
      calculatedTotalQuantity += qty;

      validatedItems.push({
        seed: seedDoc._id,
        seedName: seedDoc.name,
        quantity: qty,
        pricePerPacket: seedDoc.pricePerPacket,
        packetWeightGrams: seedDoc.packetWeightGrams || 25,
        totalItemPrice: itemTotalPrice,
        totalItemWeightGrams: itemTotalWeight,
      });
    }

    // Step 2: Atomic update to deduct inventory
    for (const validItem of validatedItems) {
      await Seed.findByIdAndUpdate(validItem.seed, {
        $inc: {
          availableStock: -validItem.quantity,
          totalPurchased: validItem.quantity,
        },
      });
    }

    // Step 3: Create Order Number
    const orderNumber = `SV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const purchase = await Purchase.create({
      user: req.user._id,
      orderNumber,
      items: validatedItems,
      totalQuantity: calculatedTotalQuantity,
      totalPrice: calculatedTotalPrice,
      totalWeightGrams: calculatedTotalWeightGrams,
      paymentMethod: paymentMethod || 'Village Seed Desk / Cash on Pickup',
      deliveryMethod: deliveryMethod || 'Self-Pickup at Village Library',
      deliveryAddress: deliveryAddress || {
        villageCity: req.user.villageCity,
        district: req.user.district,
        state: req.user.state,
        phone: req.user.phone,
      },
      status: 'Completed',
    });

    // Award Seed Guardian Points (10 pts per purchase + 2 pts per packet)
    const pointsEarned = 10 + (calculatedTotalQuantity * 2);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { guardianPoints: pointsEarned },
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Confirmed! 📦',
      message: `Your seed purchase order #${orderNumber} (${calculatedTotalQuantity} packets, ₹${calculatedTotalPrice}) has been confirmed. You earned ${pointsEarned} Guardian Points!`,
      type: 'purchase',
      link: `/purchases/${purchase._id}`,
    });

    // Log Activity
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      activityType: 'PURCHASE',
      description: `Completed purchase order #${orderNumber} for ₹${calculatedTotalPrice} (${calculatedTotalQuantity} packets, ${calculatedTotalWeightGrams}g total weight)`,
      entityId: purchase._id.toString(),
      status: 'Completed',
    });

    res.status(201).json({
      success: true,
      message: 'Purchase completed successfully!',
      purchase,
      pointsEarned,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own purchases
// @route   GET /api/purchases/my
// @access  Private
exports.getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('items.seed', 'name imageUrl category scientificName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all purchases (Admin / Librarian)
// @route   GET /api/purchases
// @access  Private (Admin / Librarian)
exports.getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find()
      .populate('user', 'fullName email phone villageCity')
      .populate('items.seed', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single purchase receipt by ID
// @route   GET /api/purchases/:id
// @access  Private
exports.getPurchaseById = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('user', 'fullName email phone villageCity district state')
      .populate('items.seed');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Order receipt not found.',
      });
    }

    // Role check: Only owner or admin/librarian can view
    if (purchase.user._id.toString() !== req.user._id.toString() && !['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this receipt.',
      });
    }

    res.status(200).json({
      success: true,
      purchase,
    });
  } catch (error) {
    next(error);
  }
};


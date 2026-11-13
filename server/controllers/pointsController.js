const User = require('../models/User');
const Return = require('../models/Return');
const SeedDeposit = require('../models/SeedDeposit');
const Purchase = require('../models/Purchase');

// Available badge criteria definition
const ALL_BADGES = [
  {
    id: 'new_sower',
    title: 'New Sower',
    icon: 'Sprout',
    threshold: 0,
    description: 'Joined the Seed Vault Village Library Community',
  },
  {
    id: 'guardian_returner',
    title: 'Seed Guardian',
    icon: 'ShieldCheck',
    threshold: 80,
    description: 'Successfully returned viable seeds on time to maintain library replenishment',
  },
  {
    id: 'heritage_depositor',
    title: 'Heritage Preserver',
    icon: 'Crown',
    threshold: 150,
    description: 'Contributed heirloom or traditional indigenous seeds to the community bank',
  },
  {
    id: 'master_horticulturist',
    title: 'Master Cultivator',
    icon: 'Sparkles',
    threshold: 300,
    description: 'Demonstrated exceptional commitment to sustainable village agriculture',
  },
  {
    id: 'century_sower',
    title: 'Century Sower',
    icon: 'Award',
    threshold: 500,
    description: 'Reached landmark milestone of 500+ Seed Guardian points',
  },
];

// @desc    Get user's points, current tier, and badge collection
// @route   GET /api/points/my
// @access  Private
exports.getMyPoints = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Compute dynamic badges based on points and activities
    const currentPoints = user.guardianPoints || 0;
    const verifiedReturnsCount = await Return.countDocuments({ user: req.user._id, status: 'Verified & Accepted' });
    const approvedDepositsCount = await SeedDeposit.countDocuments({ user: req.user._id, status: 'Approved' });
    const purchasesCount = await Purchase.countDocuments({ user: req.user._id });

    // Determine earned badges
    const earnedBadges = ALL_BADGES.map((b) => {
      let earned = false;
      if (b.id === 'new_sower') earned = true;
      if (b.id === 'guardian_returner' && (verifiedReturnsCount > 0 || currentPoints >= 80)) earned = true;
      if (b.id === 'heritage_depositor' && (approvedDepositsCount > 0 || currentPoints >= 150)) earned = true;
      if (b.id === 'master_horticulturist' && currentPoints >= 300) earned = true;
      if (b.id === 'century_sower' && currentPoints >= 500) earned = true;
      return {
        ...b,
        isUnlocked: earned,
      };
    });

    let tier = 'Bronze Sower';
    if (currentPoints >= 500) tier = 'Diamond Seed Guardian';
    else if (currentPoints >= 250) tier = 'Gold Seed Guardian';
    else if (currentPoints >= 100) tier = 'Silver Cultivator';

    res.status(200).json({
      success: true,
      points: currentPoints,
      tier,
      badges: earnedBadges,
      stats: {
        verifiedReturnsCount,
        approvedDepositsCount,
        purchasesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community leaderboard (Top farmers by guardian points)
// @route   GET /api/points/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ role: 'farmer' })
      .select('fullName villageCity district guardianPoints badges createdAt')
      .sort({ guardianPoints: -1 })
      .limit(10);

    const formattedLeaderboard = topUsers.map((u, idx) => ({
      rank: idx + 1,
      _id: u._id,
      name: u.fullName,
      location: `${u.villageCity}, ${u.district}`,
      points: u.guardianPoints,
      badgesCount: u.badges ? u.badges.length : 1,
    }));

    res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    next(error);
  }
};


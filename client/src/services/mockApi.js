import { INITIAL_SEEDS } from './seedData';

// Demo users
const DEMO_USERS = {
  admin: {
    _id: 'user_admin',
    fullName: 'Gram Panchayat Admin',
    email: 'admin@seedvault.org',
    role: 'admin',
    village: 'Ralegan Siddhi',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    guardianPoints: 350,
  },
  librarian: {
    _id: 'user_librarian',
    fullName: 'Shri Tukaram Patil',
    email: 'librarian@seedvault.org',
    role: 'librarian',
    village: 'Ralegan Siddhi',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    guardianPoints: 220,
  },
  farmer: {
    _id: 'user_farmer',
    fullName: 'Kisan Ramesh Jadhav',
    email: 'farmer@seedvault.org',
    role: 'farmer',
    village: 'Ralegan Siddhi',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    guardianPoints: 140,
  },
};

// In-memory or localStorage state helper
const getStored = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(`seedvault_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`seedvault_${key}`, JSON.stringify(val));
  } catch (e) {}
};

export const handleMockRequest = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const currentRole = localStorage.getItem('seedvault_demo_role') || 'farmer';
  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.farmer;

  // 1. Auth endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    const email = (body.email || '').toLowerCase();
    let user = DEMO_USERS.farmer;
    if (email.includes('admin')) user = DEMO_USERS.admin;
    else if (email.includes('librarian')) user = DEMO_USERS.librarian;

    localStorage.setItem('seedvault_token', 'demo_jwt_token_seedvault');
    localStorage.setItem('seedvault_demo_role', user.role);

    return {
      success: true,
      token: 'demo_jwt_token_seedvault',
      user,
    };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    if (body.role === 'admin') {
      const err = new Error('Admin registration is not permitted via public registration.');
      err.status = 403;
      throw err;
    }
    const newUser = {
      _id: 'user_' + Date.now(),
      fullName: body.fullName || 'New Member',
      email: body.email,
      role: body.role || 'farmer',
      village: body.village || 'Village',
      district: body.district || 'District',
      state: body.state || 'State',
      guardianPoints: 50,
    };
    localStorage.setItem('seedvault_token', 'demo_jwt_token_seedvault');
    localStorage.setItem('seedvault_demo_role', newUser.role);
    return {
      success: true,
      token: 'demo_jwt_token_seedvault',
      user: newUser,
    };
  }

  if (endpoint === '/auth/me' && method === 'GET') {
    return {
      success: true,
      user: currentUser,
    };
  }

  // 2. Seeds catalogue
  if (endpoint.startsWith('/seeds') && method === 'GET') {
    const seeds = getStored('seeds', INITIAL_SEEDS);
    return {
      success: true,
      count: seeds.length,
      seeds,
    };
  }

  // 3. Purchases
  if (endpoint === '/purchases' && method === 'POST') {
    const purchases = getStored('purchases', []);
    const newPurchase = {
      _id: 'pur_' + Date.now(),
      orderId: 'SV-ORD-' + Math.floor(100000 + Math.random() * 900000),
      user: currentUser,
      items: body.items || [],
      totalQuantity: body.totalQuantity || 1,
      totalWeightGrams: body.totalWeightGrams || 50,
      totalBillAmount: body.totalBillAmount || 100,
      paymentMethod: 'Simulated Cash on Delivery / Village Seed Center',
      status: 'Completed',
      createdAt: new Date().toISOString(),
    };
    purchases.unshift(newPurchase);
    setStored('purchases', purchases);
    return { success: true, purchase: newPurchase };
  }

  if (endpoint.startsWith('/purchases') && method === 'GET') {
    const purchases = getStored('purchases', []);
    return { success: true, count: purchases.length, purchases };
  }

  // 4. Borrows
  if (endpoint === '/borrows' && method === 'POST') {
    const borrows = getStored('borrows', []);
    const newBorrow = {
      _id: 'brw_' + Date.now(),
      requestId: 'SV-BRW-' + Math.floor(1000 + Math.random() * 9000),
      user: currentUser,
      items: body.items || [],
      totalPackets: body.totalPackets || 1,
      totalWeightGrams: body.totalWeightGrams || 20,
      purpose: body.purpose || 'Seasonal Sowing',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    borrows.unshift(newBorrow);
    setStored('borrows', borrows);
    return { success: true, borrowRequest: newBorrow };
  }

  if (endpoint.startsWith('/borrows') && method === 'GET') {
    const borrows = getStored('borrows', []);
    return { success: true, count: borrows.length, borrowRequests: borrows };
  }

  if (endpoint.includes('/borrows/') && method === 'PUT') {
    const borrows = getStored('borrows', []);
    return { success: true, message: 'Status updated successfully' };
  }

  // 5. Returns
  if (endpoint === '/returns' && method === 'POST') {
    const returns = getStored('returns', []);
    const newReturn = {
      _id: 'ret_' + Date.now(),
      user: currentUser,
      borrowRequestId: body.borrowRequestId,
      seedsReturned: body.seedsReturned || [],
      totalWeightReturnedGrams: body.totalWeightReturnedGrams || 100,
      germinationObserved: body.germinationObserved || 'Excellent (85%+)',
      status: 'Pending Verification',
      createdAt: new Date().toISOString(),
    };
    returns.unshift(newReturn);
    setStored('returns', returns);
    return { success: true, returnRecord: newReturn };
  }

  if (endpoint.startsWith('/returns') && method === 'GET') {
    const returns = getStored('returns', []);
    return { success: true, count: returns.length, returns };
  }

  // 6. Deposits
  if (endpoint === '/deposits' && method === 'POST') {
    const deposits = getStored('deposits', []);
    const newDeposit = {
      _id: 'dep_' + Date.now(),
      farmer: currentUser,
      seedName: body.seedName,
      category: body.category,
      quantityPackets: body.quantityPackets,
      weightGrams: body.weightGrams,
      harvestDate: body.harvestDate,
      status: 'Pending Approval',
      createdAt: new Date().toISOString(),
    };
    deposits.unshift(newDeposit);
    setStored('deposits', deposits);
    return { success: true, deposit: newDeposit };
  }

  if (endpoint.startsWith('/deposits') && method === 'GET') {
    const deposits = getStored('deposits', []);
    return { success: true, count: deposits.length, deposits };
  }

  // 7. Garden
  if (endpoint.startsWith('/garden') && method === 'GET') {
    const garden = getStored('garden', [
      {
        _id: 'gd_1',
        seedName: 'Tomato',
        varietyCategory: 'Vegetables',
        sowingDate: '2026-10-15',
        currentStage: 'Flowering & Fruit Setting',
        stageIndex: 4,
        healthStatus: 'Thriving',
        notes: 'Drip irrigated, vermicompost applied.',
      },
    ]);
    return { success: true, garden };
  }

  if (endpoint === '/garden' && method === 'POST') {
    const garden = getStored('garden', []);
    const entry = { _id: 'gd_' + Date.now(), ...body, stageIndex: 1, currentStage: 'Germination & Sprouting' };
    garden.unshift(entry);
    setStored('garden', garden);
    return { success: true, entry };
  }

  // 8. Inventory
  if (endpoint.startsWith('/inventory') && method === 'GET') {
    const seeds = getStored('seeds', INITIAL_SEEDS);
    const summary = {
      totalVarieties: seeds.length,
      totalInitialStock: 1440,
      totalAvailableStock: 1380,
      totalPurchased: 45,
      totalBorrowed: 15,
      totalReturned: 10,
      totalDeposited: 5,
      totalSeedWeightKg: 51.05,
      lowStockItemsCount: 2,
    };
    return { success: true, summary, inventory: seeds };
  }

  // 9. Points & Leaderboard
  if (endpoint.startsWith('/points') && method === 'GET') {
    return {
      success: true,
      guardianPoints: currentUser.guardianPoints || 140,
      tier: 'Village Seed Guardian',
      leaderboard: [
        { rank: 1, fullName: 'Tukaram Patil', village: 'Ralegan Siddhi', points: 420, badge: 'Master Guardian' },
        { rank: 2, fullName: 'Savitribai Phule SHG', village: 'Hiware Bazar', points: 380, badge: 'Heirloom Champion' },
        { rank: 3, fullName: 'Kisan Ramesh Jadhav', village: 'Ralegan Siddhi', points: 290, badge: 'Seed Saver' },
      ],
    };
  }

  // 10. Notifications
  if (endpoint.startsWith('/notifications') && method === 'GET') {
    return {
      success: true,
      unreadCount: 1,
      notifications: [
        {
          _id: 'notif_1',
          title: 'Welcome to Seed Vault',
          message: 'Explore 15 indigenous heritage seed varieties in our library catalogue.',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  // 11. Feedback
  if (endpoint === '/feedback' && method === 'POST') {
    const feedbacks = getStored('feedbacks', []);
    const newFb = {
      _id: 'fb_' + Date.now(),
      user: currentUser,
      overallRating: body.overallRating || 5,
      seedQualityRating: body.seedQualityRating || 5,
      platformRating: body.platformRating || 5,
      comment: body.comment || 'Great indigenous seeds preservation initiative!',
      createdAt: new Date().toISOString(),
    };
    feedbacks.unshift(newFb);
    setStored('feedbacks', feedbacks);
    return { success: true, feedback: newFb };
  }

  if (endpoint.startsWith('/feedback') && method === 'GET') {
    const feedbacks = getStored('feedbacks', [
      {
        _id: 'fb_1',
        user: { fullName: 'Santosh Kadam', role: 'farmer', village: 'Ralegan Siddhi' },
        overallRating: 5,
        seedQualityRating: 5,
        platformRating: 5,
        comment: 'The Desi Brinjal seeds had a 95% germination rate! Preserving native varieties is the best thing for our soil.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        _id: 'fb_2',
        user: { fullName: 'Sunita More', role: 'farmer', village: 'Hiware Bazar' },
        overallRating: 5,
        seedQualityRating: 4,
        platformRating: 5,
        comment: 'Easy to borrow and return. Love the Seed Guardian points!',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ]);
    return {
      success: true,
      feedbacks,
      averages: { overall: 4.9, seedQuality: 4.8, platformExperience: 5.0 },
    };
  }

  // 12. Dashboards
  if (endpoint.startsWith('/dashboard')) {
    return {
      success: true,
      stats: {
        totalUsers: 48,
        totalVarieties: 15,
        totalPackets: 1440,
        availableStock: 1380,
        totalBorrowed: 15,
        totalPurchased: 45,
        totalDeposits: 8,
        pendingApprovals: 2,
        lowStockAlerts: 1,
        guardianPoints: currentUser.guardianPoints || 140,
      },
    };
  }

  // 13. Activity
  if (endpoint.startsWith('/activity')) {
    return {
      success: true,
      activities: [
        {
          _id: 'act_1',
          action: 'SEED_BORROW',
          description: 'Borrowed 2 packets of Desi Okra seeds',
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  return { success: true, message: 'Operation processed successfully' };
};

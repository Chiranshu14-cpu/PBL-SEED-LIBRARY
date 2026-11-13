const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      villageCity,
      district,
      state,
      role,
      termsAccepted,
    } = req.body;

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the Terms and Conditions to create an account.',
      });
    }

    if (!fullName || !email || !phone || !password || !villageCity || !district || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Role Security: Disallow self-registering as 'admin'
    let assignedRole = (role || 'farmer').toLowerCase().trim();
    if (assignedRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Security policy: Administrator accounts cannot be created via public registration.',
      });
    }
    if (!['farmer', 'librarian'].includes(assignedRole)) {
      assignedRole = 'farmer';
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      password,
      villageCity,
      district,
      state,
      role: assignedRole,
      guardianPoints: 50, // Initial welcome bonus
      badges: [{
        id: 'new_sower',
        title: 'New Sower',
        icon: 'Sprout',
        description: 'Joined the Seed Vault Village Library Community',
      }],
    });

    // Create Welcome Notification
    await Notification.create({
      user: newUser._id,
      title: 'Welcome to Seed Vault! 🌱',
      message: `Namaste ${newUser.fullName}! You have successfully registered as a ${newUser.role.toUpperCase()}. You have earned 50 Seed Guardian Points as a welcome gift!`,
      type: 'points',
    });

    // Log Activity
    await ActivityLog.create({
      user: newUser._id,
      userName: newUser.fullName,
      userRole: newUser.role,
      activityType: 'USER_REGISTRATION',
      description: `Registered new account as ${newUser.role} from ${newUser.villageCity}, ${newUser.district}`,
      status: 'Success',
    });

    const token = generateToken(newUser);

    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      villageCity: newUser.villageCity,
      district: newUser.district,
      state: newUser.state,
      role: newUser.role,
      guardianPoints: newUser.guardianPoints,
      badges: newUser.badges,
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/phone and password.',
      });
    }

    const trimmedInput = emailOrPhone.trim();
    // Search by email or phone
    const user = await User.findOne({
      $or: [
        { email: trimmedInput.toLowerCase() },
        { phone: trimmedInput }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password. Please verify your credentials.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password. Please verify your credentials.',
      });
    }

    // Log login activity
    await ActivityLog.create({
      user: user._id,
      userName: user.fullName,
      userRole: user.role,
      activityType: 'USER_LOGIN',
      description: `Logged in to platform`,
      status: 'Success',
    });

    const token = generateToken(user);

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      villageCity: user.villageCity,
      district: user.district,
      state: user.state,
      role: user.role,
      guardianPoints: user.guardianPoints,
      badges: user.badges,
    };

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate password reset (Forgot Password)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
    await user.save();

    // In production we would send email via Nodemailer; for academic demonstration we provide the token in response
    res.status(200).json({
      success: true,
      message: 'Password reset request generated. Use the provided reset token or link to proceed.',
      resetToken, // Returned for instant academic evaluation testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await Notification.create({
      user: user._id,
      title: 'Security Alert: Password Changed',
      message: 'Your Seed Vault account password has been successfully updated.',
      type: 'alert',
    });

    res.status(200).json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, villageCity, district, state } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (villageCity) user.villageCity = villageCity;
    if (district) user.district = district;
    if (state) user.state = state;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        villageCity: user.villageCity,
        district: user.district,
        state: user.state,
        role: user.role,
        guardianPoints: user.guardianPoints,
        badges: user.badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};


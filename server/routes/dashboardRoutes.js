const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/admin', verifyToken, requireRole('admin'), dashboardController.getAdminDashboard);
router.get('/librarian', verifyToken, requireRole('admin', 'librarian'), dashboardController.getLibrarianDashboard);
router.get('/farmer', verifyToken, dashboardController.getFarmerDashboard);
router.get('/activity-logs', verifyToken, dashboardController.getActivityLogs);

module.exports = router;


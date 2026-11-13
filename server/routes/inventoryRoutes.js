const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole('admin', 'librarian'), inventoryController.getInventoryStats);
router.put('/:id/stock', verifyToken, requireRole('admin', 'librarian'), inventoryController.adjustStock);

module.exports = router;


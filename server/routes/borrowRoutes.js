const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, borrowController.createBorrowRequest);
router.get('/my', verifyToken, borrowController.getMyBorrows);
router.get('/', verifyToken, requireRole('admin', 'librarian'), borrowController.getAllBorrows);
router.put('/:id/status', verifyToken, requireRole('admin', 'librarian'), borrowController.updateBorrowStatus);

module.exports = router;


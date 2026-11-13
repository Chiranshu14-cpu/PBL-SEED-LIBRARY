const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, depositController.createDeposit);
router.get('/my', verifyToken, depositController.getMyDeposits);
router.get('/', verifyToken, requireRole('admin', 'librarian'), depositController.getAllDeposits);
router.put('/:id/review', verifyToken, requireRole('admin', 'librarian'), depositController.reviewDeposit);

module.exports = router;


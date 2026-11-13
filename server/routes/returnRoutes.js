const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, returnController.submitReturn);
router.get('/', verifyToken, returnController.getReturns);
router.put('/:id/verify', verifyToken, requireRole('admin', 'librarian'), returnController.verifyReturn);

module.exports = router;


const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, purchaseController.createPurchase);
router.get('/my', verifyToken, purchaseController.getMyPurchases);
router.get('/', verifyToken, requireRole('admin', 'librarian'), purchaseController.getAllPurchases);
router.get('/:id', verifyToken, purchaseController.getPurchaseById);

module.exports = router;


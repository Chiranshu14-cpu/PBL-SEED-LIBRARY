const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', seedController.getAllSeeds);
router.get('/meta/categories', seedController.getCategories);
router.get('/:id', seedController.getSeedById);

router.post('/', verifyToken, requireRole('admin'), seedController.createSeed);
router.put('/:id', verifyToken, requireRole('admin', 'librarian'), seedController.updateSeed);
router.delete('/:id', verifyToken, requireRole('admin'), seedController.deleteSeed);

module.exports = router;


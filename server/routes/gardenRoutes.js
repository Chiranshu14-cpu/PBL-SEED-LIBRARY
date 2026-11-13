const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, gardenController.getGarden);
router.post('/', verifyToken, gardenController.addPlant);
router.put('/:id', verifyToken, gardenController.updatePlantProgress);
router.delete('/:id', verifyToken, gardenController.deletePlant);

module.exports = router;


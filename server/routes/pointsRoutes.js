const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');
const { verifyToken } = require('../middleware/auth');

router.get('/my', verifyToken, pointsController.getMyPoints);
router.get('/leaderboard', pointsController.getLeaderboard);

module.exports = router;


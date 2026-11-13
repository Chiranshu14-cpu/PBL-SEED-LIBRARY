const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, feedbackController.submitFeedback);
router.get('/', feedbackController.getAllFeedback);
router.put('/:id/reply', verifyToken, requireRole('admin'), feedbackController.replyFeedback);

module.exports = router;


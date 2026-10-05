const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes are protected
router.use(protect);

router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);

module.exports = router;

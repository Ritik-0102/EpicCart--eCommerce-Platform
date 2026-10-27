// Payment routing: maps HTTP endpoints to paymentController functions
const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment interactions require an authenticated session
router.use(protect);

// Step 1: Create an authenticated Razorpay order ID for the checkout modal
router.post('/initiate', initiatePayment);

// Step 2: Cryptographically verify the HMAC-SHA256 signature returned by Razorpay
router.post('/verify', verifyPayment);

module.exports = router;

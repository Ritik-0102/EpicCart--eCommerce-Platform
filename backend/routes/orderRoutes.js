// Order routing: maps HTTP endpoints to orderController functions
const express = require('express');
const router = express.Router();
const { 
  getCheckoutSummary, 
  createOrder, 
  getMyOrders, 
  getOrderById 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Require authentication for all order-related endpoints
router.use(protect);

// Calculate totals and apply coupons before checkout
router.post('/checkout-summary', getCheckoutSummary);

// Create an order in PENDING status from the user's cart
router.post('/', createOrder);

// Fetch order history for the logged-in customer
router.get('/', getMyOrders);

// Fetch a single order by ID (with authorization check)
router.get('/:id', getOrderById);

module.exports = router;

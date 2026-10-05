const express = require('express');
const router = express.Router();
const { 
  getCheckoutSummary, 
  createOrder, 
  getMyOrders, 
  getOrderById 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are protected (require authentication)
router.use(protect);

router.post('/checkout-summary', getCheckoutSummary);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;

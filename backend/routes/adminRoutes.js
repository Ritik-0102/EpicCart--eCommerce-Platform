const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  updateProductStock
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes must be protected and require admin role
router.use(protect, admin);

router.get('/summary', getDashboardSummary);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/products/:id/stock', updateProductStock);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  setupAdmin,
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  updateProductStock,
  getInventoryLogs,
  getCustomers,
  getAuditLogs
} = require('../controllers/adminController');
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const {
  getAllReviewsAdmin,
  deleteReviewAdmin
} = require('../controllers/reviewController');
const {
  getStoreSettings,
  updateStoreSettings
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { auditLogMiddleware } = require('../middleware/auditMiddleware');

// Bootstrap route - intentionally mounted before the admin protection middleware
// The controller validates the ADMIN_BOOTSTRAP_SECRET and ensures no admin exists yet.
router.post('/setup', setupAdmin);

// All other admin routes must be protected and require admin role
router.use(protect, admin, auditLogMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/products/:id/stock', updateProductStock);
router.get('/inventory', getInventoryLogs);
router.get('/users', getCustomers);
router.get('/audit-logs', getAuditLogs);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Reviews
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);

// Settings
router.get('/settings', getStoreSettings);
router.put('/settings', updateStoreSettings);

module.exports = router;

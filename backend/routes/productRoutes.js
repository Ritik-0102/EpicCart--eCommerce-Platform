// Product routing: maps HTTP endpoints to productController functions
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');
const { auditLogMiddleware } = require('../middleware/auditMiddleware');
const { createReview, getProductReviews } = require('../controllers/reviewController');

// Public storefront routes (browsing products does not require login)
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);

// Customer protected route: submitting a product review requires a valid login token
router.post('/:id/reviews', protect, createReview);

// Admin-only management routes (creating, updating, and deleting products)
// Pipeline: authenticate user -> verify admin role -> write audit log -> execute controller
router.post('/', protect, admin, auditLogMiddleware, createProduct);
router.put('/:id', protect, admin, auditLogMiddleware, updateProduct);
router.delete('/:id', protect, admin, auditLogMiddleware, deleteProduct);

module.exports = router;

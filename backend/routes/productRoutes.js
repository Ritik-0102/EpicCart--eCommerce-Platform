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

// Map routes to controller methods
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createReview);

router.post('/', protect, admin, auditLogMiddleware, createProduct);
router.put('/:id', protect, admin, auditLogMiddleware, updateProduct);
router.delete('/:id', protect, admin, auditLogMiddleware, deleteProduct);

module.exports = router;

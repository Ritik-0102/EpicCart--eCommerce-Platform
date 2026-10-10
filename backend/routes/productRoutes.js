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
const { createReview, getProductReviews } = require('../controllers/reviewController');

// Map routes to controller methods
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createReview);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;

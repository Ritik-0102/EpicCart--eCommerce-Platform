const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { auditLogMiddleware } = require('../middleware/auditMiddleware');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Map routes to their respective controller functions
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, admin, auditLogMiddleware, createCategory);
router.put('/:id', protect, admin, auditLogMiddleware, updateCategory);
router.delete('/:id', protect, admin, auditLogMiddleware, deleteCategory);

module.exports = router;

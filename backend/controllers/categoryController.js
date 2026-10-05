const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error); // Passes the error to our centralized error handler
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Basic validation: ensure ID is a number
    if (isNaN(categoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true } // Also fetch all products belonging to this category
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById
};

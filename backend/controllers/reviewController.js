const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        productId
      }
    });

    res.status(201).json({ success: true, data: review, message: 'Review added successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;

    res.status(200).json({ 
      success: true, 
      data: reviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: reviews.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReviewAdmin = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    if (isNaN(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID format' });
    }

    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  deleteReviewAdmin
};

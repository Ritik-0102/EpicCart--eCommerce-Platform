const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to get or create a wishlist for the user
const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: { items: { include: { product: true } } }
    });
  }
  return wishlist;
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const wishlist = await getOrCreateWishlist(req.user.id);

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId: parseInt(productId) } }
    });

    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Product is already in your wishlist' });
    }

    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: parseInt(productId)
      }
    });

    const updatedWishlist = await getOrCreateWishlist(req.user.id);
    res.status(201).json({ success: true, data: updatedWishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
const removeFromWishlist = async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId);

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { wishlist: true }
    });

    if (!wishlistItem || wishlistItem.wishlist.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    await prisma.wishlistItem.delete({
      where: { id: itemId }
    });

    const updatedWishlist = await getOrCreateWishlist(req.user.id);
    res.status(200).json({ success: true, data: updatedWishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };

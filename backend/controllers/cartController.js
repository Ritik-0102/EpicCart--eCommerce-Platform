const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to get or create a cart for the logged-in user
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } }
    });
  }
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    // Calculate totals on the backend
    let totalPrice = 0;
    let totalItems = 0;
    cart.items.forEach(item => {
      totalPrice += item.quantity * item.product.price;
      totalItems += item.quantity;
    });

    res.status(200).json({
      success: true,
      data: { ...cart, totalPrice, totalItems }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // 1. Check product stock
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // 2. Get Cart
    const cart = await getOrCreateCart(req.user.id);

    // 3. Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: parseInt(productId) } }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + parseInt(quantity);
      if (newQuantity > product.stock) {
        return res.status(400).json({ success: false, message: 'Cannot add more than available stock' });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: parseInt(quantity)
        }
      });
    }

    // 4. Return updated cart
    const updatedCart = await getOrCreateCart(req.user.id);
    let totalPrice = 0;
    let totalItems = 0;
    updatedCart.items.forEach(item => {
      totalPrice += item.quantity * item.product.price;
      totalItems += item.quantity;
    });

    res.status(200).json({ success: true, data: { ...updatedCart, totalPrice, totalItems } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const itemId = parseInt(req.params.itemId);

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true, cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) }
    });

    const updatedCart = await getOrCreateCart(req.user.id);
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeFromCart = async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    const updatedCart = await getOrCreateCart(req.user.id);
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @desc    Get checkout summary (subtotal, shipping, discount, total)
 * @route   POST /api/orders/checkout-summary
 * @access  Private
 */
const getCheckoutSummary = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    
    // 1. Fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // 2. Calculate Subtotal securely using database prices
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += item.quantity * item.product.price;
    });

    // 3. Apply Coupon if provided
    let discount = 0;
    let validCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });

      if (coupon && coupon.isActive) {
        validCoupon = coupon;
        if (coupon.isPercentage) {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        
        // Ensure discount doesn't exceed subtotal
        if (discount > subtotal) {
          discount = subtotal;
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code'
        });
      }
    }

    const total = subtotal - discount; // Free shipping in this simple implementation

    res.status(200).json({
      success: true,
      data: {
        subtotal,
        discount,
        total,
        coupon: validCoupon ? { code: validCoupon.code, discountValue: validCoupon.discountValue, isPercentage: validCoupon.isPercentage } : null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, city, postalCode, country, couponCode } = req.body;

    // 1. Basic validation for address
    if (!shippingAddress || !city || !postalCode || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address'
      });
    }

    // 2. Fetch cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // 3. Calculate totals securely
    let subtotal = 0;
    for (const item of cart.items) {
      // Validate stock availability
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.product.name}`
        });
      }
      subtotal += item.quantity * item.product.price;
    }

    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });
      if (coupon && coupon.isActive) {
        couponId = coupon.id;
        if (coupon.isPercentage) {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        if (discount > subtotal) discount = subtotal;
      }
    }

    const total = subtotal - discount;

    // 4. Create Order and OrderItems in a transaction
    // Also decrease product stock and clear the cart
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          subtotal,
          discount,
          total,
          couponId,
          status: 'PENDING', // Will change to PAID once payment gateway is integrated
          shippingAddress,
          city,
          postalCode,
          country,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,     // Snapshot of price
              quantity: item.quantity        // Snapshot of quantity
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Decrease stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear the user's cart ONLY after successful order creation
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true
      }
    });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        coupon: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCheckoutSummary,
  createOrder,
  getMyOrders,
  getOrderById
};

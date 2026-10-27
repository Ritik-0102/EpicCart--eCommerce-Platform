// Order controller handling checkout calculations, order placement, and order history
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @desc    Get checkout summary (subtotal, coupon discount, total calculation)
 * @route   POST /api/orders/checkout-summary
 * @access  Private (Logged-in user)
 */
const getCheckoutSummary = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    
    // 1. Fetch user's cart and join product details to use authoritative database prices
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    // Check if cart has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // 2. Calculate subtotal securely from server prices (never trusting client-provided prices)
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += item.quantity * item.product.price;
    });

    // 3. Validate and apply coupon code if provided
    let discount = 0;
    let validCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });

      // Confirm coupon exists and is currently active
      if (coupon && coupon.isActive) {
        validCoupon = coupon;
        if (coupon.isPercentage) {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        
        // Ensure discount never exceeds total subtotal
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

    // Free standard shipping in this store implementation
    const total = subtotal - discount;

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
 * @desc    Create a new order from the current shopping cart
 * @route   POST /api/orders
 * @access  Private (Logged-in user)
 */
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, city, postalCode, country, couponCode } = req.body;

    // 1. Basic validation for shipping address fields
    if (!shippingAddress || !city || !postalCode || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address'
      });
    }

    // 2. Fetch the user's cart with items and product records
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

    // 3. Verify stock availability and recalculate subtotal
    let subtotal = 0;
    for (const item of cart.items) {
      // Check if product has enough inventory
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.product.name}`
        });
      }
      subtotal += item.quantity * item.product.price;
    }

    // Calculate coupon discounts
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

    // 4. Create the Order with initial status "PENDING" awaiting Razorpay payment verification
    // Notice: We snapshot the product price and quantity into OrderItem records
    // Stock is decremented and cart cleared ONLY once payment is cryptographically verified
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal,
        discount,
        total,
        couponId,
        status: 'PENDING',
        shippingAddress,
        city,
        postalCode,
        country,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            productName: item.product.name,
            price: item.product.price,     // Snapshot of price at time of purchase
            quantity: item.quantity        // Snapshot of purchased quantity
          }))
        }
      },
      include: {
        items: true
      }
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
 * @desc    Get order history for the logged-in customer
 * @route   GET /api/orders
 * @access  Private (Logged-in user)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const { includePending } = req.query;
    
    // Only return confirmed/paid orders (PAID, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED)
    // Unpaid PENDING checkout attempts must not appear as confirmed purchases unless explicitly requested
    const whereClause = {
      userId: req.user.id,
      ...(includePending === 'true' ? {} : { NOT: { status: 'PENDING' } })
    };

    // Query orders belonging to this user, newest first
    const orders = await prisma.order.findMany({
      where: whereClause,
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
 * @desc    Get details for a specific order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Logged-in user)
 */
const getOrderById = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    // Find order along with line items and applied coupon
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

    // Security check: ensure customer can only view their own orders
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

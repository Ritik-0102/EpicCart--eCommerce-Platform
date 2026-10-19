const Razorpay = require('razorpay');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Razorpay instance
// In a real application, you'd handle missing keys more gracefully
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

/**
 * @desc    Initiate a Razorpay payment for an existing order
 * @route   POST /api/payments/initiate
 * @access  Private
 */
const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    // 1. Find the order and verify it belongs to the user and is PENDING
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Order is already ${order.status}` });
    }

    // 2. Prevent duplicate Razorpay orders if one already exists for this order
    // In test mode, we might just create a new one, but let's be safe.
    if (order.razorpayOrderId) {
      // Could optionally return the existing razorpay order details here
    }

    // 3. Create a Razorpay Order
    // Razorpay requires amount in smallest currency unit (e.g., paise for INR)
    const amountInSmallestUnit = Math.round(order.total * 100);

    const options = {
      amount: amountInSmallestUnit,
      currency: "INR",
      receipt: `receipt_order_${order.id}`,
      payment_capture: 1 // Auto capture
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 4. Save the razorpayOrderId to our database
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id }
    });

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order.id,
        key: process.env.RAZORPAY_KEY_ID || ''
      }
    });

  } catch (error) {
    // Log without exposing sensitive objects directly
    console.error('Razorpay Initiation Error:', error.description || error.message || 'Unknown error');
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate payment', 
      error: error.description || error.message || 'Internal server error' 
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // 1. Generate the expected signature
    // The expected signature is an HMAC hex digest of "razorpay_order_id|razorpay_payment_id"
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest('hex');

    // 2. Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // 3. Signature is valid, update order status to PAID in a safe transaction
    // Product stock is decremented and cart cleared ONLY once payment is cryptographically verified
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          items: true,
          user: true
        }
      });

      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // Idempotency: if already paid, do not re-decrement stock or re-clear cart
      if (existingOrder.status === 'PAID') {
        return existingOrder;
      }

      // Update order status and payment IDs
      const orderRecord = await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          status: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        include: {
          items: true,
          user: true
        }
      });

      // Decrement product stock
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear the user's cart
      const userCart = await tx.cart.findUnique({
        where: { userId: existingOrder.userId }
      });
      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id }
        });
      }

      // Increment coupon usage if a coupon was used
      if (existingOrder.couponId) {
        await tx.coupon.update({
          where: { id: existingOrder.couponId },
          data: { usedCount: { increment: 1 } }
        });
      }

      return orderRecord;
    });

    // Send email notification upon verified payment (Fail-safe)
    try {
      const sendEmail = require('../utils/sendEmail');
      const formattedTotal = Number(updatedOrder.total).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      await sendEmail({
        email: updatedOrder.user.email,
        subject: `Order Confirmation - #${updatedOrder.id}`,
        message: `Thank you for your order, ${updatedOrder.user.name}!\n\nYour payment was successful and Order #${updatedOrder.id} is confirmed.\nTotal amount paid: ₹${formattedTotal}\nPayment ID: ${razorpay_payment_id}\n\nWe will notify you once it ships.`,
        html: `<h2>Thank you for your order, ${updatedOrder.user.name}!</h2><p>Your payment was successful and Order <strong>#${updatedOrder.id}</strong> is confirmed.</p><p>Total amount paid: <strong>₹${formattedTotal}</strong></p><p>Razorpay Payment ID: <code>${razorpay_payment_id}</code></p><p>We will notify you once it ships.</p>`
      });
    } catch (emailError) {
      console.error('Confirmation email could not be sent:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment', error: error.message });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment
};

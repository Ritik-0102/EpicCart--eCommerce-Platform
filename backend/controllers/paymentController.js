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
    // Razorpay requires amount in smallest currency unit (e.g., paise for INR, cents for USD)
    // We will assume USD for EpicCart, so multiply by 100
    const amountInSmallestUnit = Math.round(order.total * 100);

    const options = {
      amount: amountInSmallestUnit,
      currency: "USD",
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
        orderId: order.id
      }
    });

  } catch (error) {
    console.error('Razorpay Initiation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment', error: error.message });
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

    // 3. Signature is valid, update order status to PAID
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      }
    });

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

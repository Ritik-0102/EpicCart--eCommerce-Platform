const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all coupons
// @route   GET /api/admin/coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { id: 'desc' }
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/admin/coupons
const createCoupon = async (req, res, next) => {
  try {
    const { code, discountValue, isPercentage, isActive, expiryDate, minPurchase, usageLimit } = req.body;
    if (!code || discountValue === undefined || isPercentage === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountValue: parseFloat(discountValue),
        isPercentage: Boolean(isPercentage),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        minPurchase: minPurchase ? parseFloat(minPurchase) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null
      }
    });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
const updateCoupon = async (req, res, next) => {
  try {
    const couponId = parseInt(req.params.id);
    const { code, discountValue, isPercentage, isActive, expiryDate, minPurchase, usageLimit } = req.body;
    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        isPercentage: isPercentage !== undefined ? Boolean(isPercentage) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : undefined,
        minPurchase: minPurchase !== undefined ? (minPurchase ? parseFloat(minPurchase) : null) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined
      }
    });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res, next) => {
  try {
    const couponId = parseInt(req.params.id);
    await prisma.coupon.delete({ where: { id: couponId } });
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};


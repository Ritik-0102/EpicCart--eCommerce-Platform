const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get dashboard summary (users, orders, products)
// @route   GET /api/admin/summary
const getDashboardSummary = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    
    // Calculate total revenue
    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' }
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product inventory (stock)
// @route   PUT /api/admin/products/:id/stock
const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const productId = parseInt(req.params.id);

    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: parseInt(stock) }
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Note: Create/Update/Delete endpoints for Product and Category could also live here 
// or in their respective controllers behind the `admin` middleware.
// For simplicity, we assume they are added to productRoutes/categoryRoutes using `protect, admin` middlewares.

module.exports = {
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  updateProductStock
};

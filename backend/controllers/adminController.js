const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    One-time setup for the initial Admin user
// @route   POST /api/admin/setup
const setupAdmin = async (req, res, next) => {
  try {
    const { name, email, password, bootstrapSecret } = req.body;

    // Validate the bootstrap secret
    if (!process.env.ADMIN_BOOTSTRAP_SECRET || bootstrapSecret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid or missing bootstrap secret' });
    }

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Check if ANY admin already exists
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount > 0) {
      return res.status(403).json({ success: false, message: 'An admin user already exists. Setup cannot be run again.' });
    }

    // Check if email is already taken by a regular user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Could potentially upgrade them, but safer to just reject or upgrade explicitly.
      // Let's just upgrade them to ADMIN and update password if they exist.
      // But creating fresh is safer. Let's just reject for now if email is taken.
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser.id),
      }
    });
  } catch (error) {
    next(error);
  }
};

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
    const { stock, reason } = req.body;
    const productId = parseInt(req.params.id);
    
    if (stock === undefined || stock === null) {
      return res.status(400).json({ success: false, message: 'Stock value is required' });
    }

    const parsedStock = Number(stock);
    if (!Number.isInteger(parsedStock)) {
      return res.status(400).json({ success: false, message: 'Stock must be a valid integer' });
    }

    if (parsedStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    if (parsedStock > 2147483647) {
      return res.status(400).json({ success: false, message: 'Stock exceeds maximum allowed limit' });
    }

    const newStock = parsedStock;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prevQuantity = existingProduct.stock;
    const adjustment = newStock - prevQuantity;

    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock }
    });

    // Write to InventoryLog
    await prisma.inventoryLog.create({
      data: {
        productId,
        adminId: req.user.id,
        prevQuantity,
        newQuantity: newStock,
        adjustment,
        reason: reason || 'Manual stock update'
      }
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Note: Create/Update/Delete endpoints for Product and Category could also live here 
// or in their respective controllers behind the `admin` middleware.
// For simplicity, we assume they are added to productRoutes/categoryRoutes using `protect, admin` middlewares.

// @desc    Get inventory logs
// @route   GET /api/admin/inventory
const getInventoryLogs = async (req, res, next) => {
  try {
    const logs = await prisma.inventoryLog.findMany({
      include: { 
        product: { select: { name: true, sku: true } },
        admin: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (customers/admins)
// @route   GET /api/admin/users
const getCustomers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        admin: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 200 // limit to recent 200 for performance
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setupAdmin,
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  updateProductStock,
  getInventoryLogs,
  getCustomers,
  getAuditLogs
};

// Express application setup module
// This file configures middleware, mounts routers, and defines error handlers
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS so the browser can fetch data across origins
app.use(cors());

// Parse incoming requests with JSON payloads into req.body
app.use(express.json());

// Import all route modules
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes to their API endpoints
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint returning status and current timestamp
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EpicCart API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for any requests that did not match an existing route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only share stack traces during development to avoid leaking internal details in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Export the configured app instance
module.exports = app;

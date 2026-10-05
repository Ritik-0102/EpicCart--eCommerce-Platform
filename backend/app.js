const express = require('express');
const cors = require('cors');

// Initialize the Express application
const app = express();

// --- MIDDLEWARE ---
// Enable CORS for all routes (allows frontend to fetch data)
app.use(cors());

// Middleware to parse incoming JSON requests.
// Without this, req.body would be undefined when clients send JSON data.
app.use(express.json());


// --- ROUTE IMPORTS ---
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const adminRoutes = require('./routes/adminRoutes');

// --- ROUTES ---
// Mount the category and product routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
// Purpose: A simple route to verify that our API is up and running.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EpicCart API is running smoothly',
    timestamp: new Date().toISOString()
  });
});


// --- 404 NOT FOUND HANDLER ---
// If a request makes it past all the routes above and doesn't match any of them,
// this middleware will catch it and return a 404 error.
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});


// --- CENTRALIZED ERROR HANDLER ---
// This is a special middleware with 4 arguments (err, req, res, next).
// Express recognizes it as an error handler. All internal server errors get caught here.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for developers
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // We only send the stack trace if we are in development mode to avoid leaking sensitive info
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Export the app instance so it can be used by server.js
module.exports = app;

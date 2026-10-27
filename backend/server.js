// Main server entrypoint for the EpicCart Express backend
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from the local .env file into process.env
dotenv.config();

// Create the Express application instance
const app = express();
// Use the port provided by the cloud platform (Render) or default to 5000 locally
const PORT = process.env.PORT || 5000;

// Middleware to automatically parse incoming request bodies sent as JSON
app.use(express.json());

// Configure Cross-Origin Resource Sharing (CORS) so our React frontend can make API calls
const corsOptions = {
  // Allow requests from the configured frontend URL or default to local port 80
  origin: process.env.FRONTEND_URL || 'http://localhost:80',
  credentials: true,
};
app.use(cors(corsOptions));

// Import all API route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount route handlers under their respective /api path prefixes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint used by Render and Kubernetes liveness/readiness probes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EpicCart Backend' });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the EpicCart API');
});

// Centralized error handling middleware catches unhandled errors and returns JSON
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start listening for incoming HTTP connections on the designated port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

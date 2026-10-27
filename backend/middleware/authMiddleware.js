// Authentication and role authorization middleware
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to protect routes that require a valid logged-in user
const protect = (req, res, next) => {
  try {
    let token;

    // Extract Bearer token from the HTTP Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Reject request if no token was sent
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route, no token provided' 
      });
    }

    // Verify token cryptographic signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    // Attach user ID to the request object so subsequent route handlers can access it
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    // Return 401 Unauthorized if the token was tampered with or expired
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed or expired' 
    });
  }
};

// Middleware to restrict access to administrator accounts only
const admin = async (req, res, next) => {
  try {
    // Confirm the user ID was attached by the protect middleware first
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Look up the user in the database to check their current role
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Check if the user has the ADMIN role
    if (user && user.role === 'ADMIN') {
      req.user = user; // Attach full user object for admin route handlers
      next();
    } else {
      // 403 Forbidden: User is authenticated, but lacks admin permissions
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error verifying role' });
  }
};

module.exports = { protect, admin };

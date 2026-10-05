const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route, no token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed or expired' 
    });
  }
};

// Middleware to protect routes that require ADMIN role
const admin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (user && user.role === 'ADMIN') {
      req.user = user; // Attach full user object
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error verifying role' });
  }
};

module.exports = { protect, admin };

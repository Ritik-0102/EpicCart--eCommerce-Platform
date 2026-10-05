const jwt = require('jsonwebtoken');

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
  try {
    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route, no token provided' 
      });
    }

    // Verify token cryptographically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object so subsequent middleware/controllers can use it
    req.user = { id: decoded.id };

    // Move to the next middleware or controller
    next();
  } catch (error) {
    // If jwt.verify fails (e.g. token expired, malformed), it throws an error
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed or expired' 
    });
  }
};

module.exports = { protect };


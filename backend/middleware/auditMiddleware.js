const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware to automatically log admin actions (POST, PUT, DELETE)
 */
const auditLogMiddleware = async (req, res, next) => {
  // Store the original res.json to intercept the response and ensure we only log on success
  const originalJson = res.json;

  res.json = function (data) {
    // Only log if the response was successful
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const actionMap = {
          'POST': 'CREATE',
          'PUT': 'UPDATE',
          'DELETE': 'DELETE'
        };

        const action = actionMap[req.method] || req.method;
        
        // Extract targetType from URL (e.g. /api/admin/products -> Product)
        // Basic mapping based on path segments
        const pathSegments = req.originalUrl.split('/').filter(Boolean);
        let targetType = 'Unknown';
        
        if (pathSegments.includes('products')) targetType = 'Product';
        else if (pathSegments.includes('categories')) targetType = 'Category';
        else if (pathSegments.includes('orders')) targetType = 'Order';
        else if (pathSegments.includes('coupons')) targetType = 'Coupon';
        else if (pathSegments.includes('reviews')) targetType = 'Review';
        else if (pathSegments.includes('settings')) targetType = 'Settings';
        else if (pathSegments.includes('users')) targetType = 'User';

        let targetId = req.params.id || req.body.id || null;
        if (targetId) {
          targetId = String(targetId);
        }

        // Sanitize body to avoid logging sensitive data
        let sanitizedBody = {};
        if (req.body && typeof req.body === 'object') {
          sanitizedBody = { ...req.body };
          const sensitiveKeys = ['password', 'token', 'secret', 'key', 'creditCard'];
          Object.keys(sanitizedBody).forEach(key => {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
              sanitizedBody[key] = '[REDACTED]';
            }
          });
        }

        // We run this asynchronously so it doesn't block the response
        prisma.auditLog.create({
          data: {
            adminId: req.user.id,
            action,
            targetType,
            targetId,
            metadata: Object.keys(sanitizedBody).length ? JSON.stringify(sanitizedBody) : null
          }
        }).catch(err => console.error('Failed to write audit log:', err));
      }
    }
    
    // Call the original res.json
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  auditLogMiddleware
};


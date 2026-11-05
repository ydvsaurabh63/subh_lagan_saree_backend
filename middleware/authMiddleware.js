import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (req.user.accountStatus !== 'active') {
        return res.status(403).json({ success: false, message: 'Your account is suspended or inactive' });
      }

      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Admin Authorization Middleware (allows client, admin, and superadmin for store management)
export const adminOnly = (req, res, next) => {
  if (req.user && ['admin', 'superadmin', 'client'].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin or Client authorization required',
    });
  }
};

// Superadmin Only Middleware
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Superadmin authorization required',
    });
  }
};

// Admin or Superadmin Middleware
export const adminOrSuperAdminOnly = (req, res, next) => {
  if (req.user && ['superadmin', 'admin'].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin or Superadmin authorization required',
    });
  }
};

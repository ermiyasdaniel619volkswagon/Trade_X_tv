

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Customer from '../models/Customer.js'; // ✅ IMPORT Customer
import { logger } from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token is required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    // ✅ CHECK BOTH MODELS
    let user = await User.findById(decoded.userId).select('-password');
    let isCustomer = false;

    if (!user) {
      user = await Customer.findById(decoded.userId).select('-password');
      if (user) {
        isCustomer = true;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account deactivated. Please contact administrator.',
        code: 'ACCOUNT_DEACTIVATED',
      });
    }

    req.userId = user._id;
    req.userRole = isCustomer ? 'customer' : user.role;
    req.user = user;
    req.isCustomer = isCustomer;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

export const requireSupervisor = authorize('supervisor');
export const requireMediaOfficer = authorize('media_officer', 'supervisor');
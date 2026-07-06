

import User from '../../models/User.js';
import Customer from '../../models/Customer.js';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';
import { validateLogin, validateRegister } from '../../validators/authValidator.js';
import { generateEmployeeId } from '../../utils/helpers.js';

// ✅ MOVED TO TOP - generateToken MUST be defined BEFORE it's used
const generateToken = (userId, role = 'customer') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// =============================================
// ✅ LOGIN - Supports ALL 3 Actors (Customer, Media Officer, Supervisor)
// =============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Try User model first
    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    let isCustomer = false;

    // If not found, try Customer model
    if (!user) {
      user = await Customer.findOne({ email: email.toLowerCase() }).select('+password');
      if (user) {
        isCustomer = true;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, isCustomer ? 'customer' : user.role);

    let userData;
    let redirectUrl;

    if (isCustomer) {
      userData = {
        id: user._id,
        email: user.email,
        role: 'customer',
        firstName: 'Customer',
        lastName: user.email.split('@')[0] || 'User',
        isActive: user.isActive,
      };
      redirectUrl = '/customer/dashboard';
    } else {
      userData = {
        id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        role: user.role,
        employeeId: user.employeeId || '',
        department: user.department || '',
        isActive: user.isActive,
      };
      redirectUrl = user.role === 'supervisor' ? '/admin/overview' : '/dashboard/report';
    }

    logger.info(`✅ ${isCustomer ? 'Customer' : 'User'} logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      token,
      user: userData,
      redirectUrl,
    });
  } catch (error) {
    logger.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ REGISTER - Media Officer (Admin only)
// =============================================
export const register = async (req, res) => {
  try {
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const { firstName, lastName, email, password, department, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered as a customer',
      });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'media_officer',
      department: department || 'production',
      employeeId: generateEmployeeId(),
      isActive: true,
      phoneNumber: phoneNumber || '',
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
    };

    logger.info(`✅ New user registered: ${user.email} (${user.role})`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userData,
      redirectUrl: '/dashboard/report',
    });
  } catch (error) {
    logger.error('❌ Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ CUSTOMER REGISTRATION - Email + Password ONLY
// ✅ Uses the CORRECT Customer model
// =============================================
export const registerCustomer = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Check if email exists in User model
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered. Please login.',
      });
    }

    // Check if email exists in Customer model
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered. Please login.',
      });
    }

    // ✅ Create new customer using the CORRECT Customer model
    const customer = new Customer({
      email: email.toLowerCase(),
      password: password,
      isActive: true,
    });

    await customer.save();

    logger.info(`✅ New customer registered: ${customer.email}`);

    return res.status(201).json({
      success: true,
      message: 'Customer account created successfully! Please login.',
      customer: {
        id: customer._id,
        email: customer.email,
        role: 'customer',
        isActive: customer.isActive,
      }
    });
  } catch (error) {
    logger.error('❌ Customer registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered. Please login.',
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
};

// =============================================
// ✅ LOGOUT
// =============================================
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ GET CURRENT USER
// =============================================
export const me = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    let user;
    let isCustomer = false;

    if (userRole === 'customer') {
      user = await Customer.findById(userId).select('-password');
      isCustomer = true;
    } else {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    let userData;
    if (isCustomer) {
      userData = {
        id: user._id,
        email: user.email,
        role: 'customer',
        firstName: 'Customer',
        lastName: user.email.split('@')[0] || 'User',
        isActive: user.isActive,
      };
    } else {
      userData = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
      };
    }

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ REFRESH TOKEN
// =============================================
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    const { userId, role } = decoded;

    let user;
    if (role === 'customer') {
      user = await Customer.findById(userId).select('isActive');
    } else {
      user = await User.findById(userId).select('isActive');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.',
      });
    }

    const newToken = generateToken(userId, role);

    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
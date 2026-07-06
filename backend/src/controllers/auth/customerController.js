// // backend/src/controllers/auth/customerController.js
// ✅ KEEP THIS FILE - Customer-specific registration only

import Customer from '../../models/Customer.js';
import User from '../../models/User.js';
import { logger } from '../../utils/logger.js';

// =============================================
// ✅ CUSTOMER REGISTRATION - Uses Customer model
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
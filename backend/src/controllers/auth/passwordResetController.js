import crypto from 'crypto';
import Customer from '../../models/Customer.js';
import { sendPasswordResetEmail } from '../../services/emailService.js';
import { logger } from '../../utils/logger.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const GENERIC_RESPONSE = 'If a customer account exists for that email, a reset link has been sent.';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const forgotPassword = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  try {
    const customer = await Customer.findOne({ email, isActive: true });
    if (!customer) {
      return res.status(200).json({ success: true, message: GENERIC_RESPONSE });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    customer.passwordResetToken = hashToken(resetToken);
    customer.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await customer.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({ email: customer.email, resetUrl, firstName: customer.firstName });
    } catch (mailError) {
      customer.passwordResetToken = undefined;
      customer.passwordResetExpires = undefined;
      await customer.save({ validateBeforeSave: false });
      throw mailError;
    }

    return res.status(200).json({ success: true, message: GENERIC_RESPONSE });
  } catch (error) {
    logger.error('Password reset email error:', error);
    // Keep the public response identical so callers cannot discover registered emails.
    return res.status(200).json({ success: true, message: GENERIC_RESPONSE });
  }
};

export const resetPassword = async (req, res) => {
  const token = String(req.params.token || '');
  const { password, confirmPassword } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match.' });
  }

  try {
    const customer = await Customer.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    }).select('+passwordResetToken +passwordResetExpires');

    if (!customer) {
      return res.status(400).json({ success: false, error: 'This reset link is invalid or has expired.' });
    }

    customer.password = password;
    customer.passwordResetToken = undefined;
    customer.passwordResetExpires = undefined;
    await customer.save();

    logger.info(`Customer password reset completed: ${customer.email}`);
    return res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    logger.error('Password reset error:', error);
    return res.status(500).json({ success: false, error: 'Unable to reset the password. Please try again later.' });
  }
};

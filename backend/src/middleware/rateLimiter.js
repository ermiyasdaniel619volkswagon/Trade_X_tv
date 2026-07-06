import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// ===================== GENERAL API RATE LIMITER =====================
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded: ${req.ip} - ${req.path}`);
    res.status(options.statusCode).json(options.message);
  },
});

// ===================== AUTH RATE LIMITER (Stricter) =====================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 login attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many login attempts. Please try again after 15 minutes.',
    retryAfter: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded: ${req.ip} - ${req.body?.email || 'unknown email'}`);
    res.status(options.statusCode).json(options.message);
  },
});

// ===================== STRICT RATE LIMITER (For sensitive endpoints) =====================
export const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    success: false,
    error: 'Too many requests. Please try again after 5 minutes.',
    retryAfter: 300,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Strict rate limit exceeded: ${req.ip} - ${req.path}`);
    res.status(options.statusCode).json(options.message);
  },
});

// ===================== REPORT RATE LIMITER =====================
export const reportLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 report submissions per minute
  message: {
    success: false,
    error: 'Too many report submissions. Please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Report rate limit exceeded: ${req.ip} - ${req.userId || 'unknown user'}`);
    res.status(options.statusCode).json(options.message);
  },
});

// ===================== NOTIFICATION RATE LIMITER =====================
export const notificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 notification requests per minute
  message: {
    success: false,
    error: 'Too many notification requests. Please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Notification rate limit exceeded: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

// ===================== USER MANAGEMENT RATE LIMITER =====================
export const userManagementLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 user management actions per 5 minutes
  message: {
    success: false,
    error: 'Too many user management actions. Please slow down.',
    retryAfter: 300,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`User management rate limit exceeded: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

export default {
  apiLimiter,
  authLimiter,
  strictLimiter,
  reportLimiter,
  notificationLimiter,
  userManagementLimiter,
};
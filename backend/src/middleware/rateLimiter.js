import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';
import MongoRateLimitStore from '../services/mongoRateLimitStore.js';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const isRateLimitingDisabled = () => (
  String(process.env.RATE_LIMIT_ENABLED || 'false').trim().toLowerCase() !== 'true'
);

const firstHeaderValue = (value) => {
  if (Array.isArray(value)) return value[0];
  return String(value || '').split(',')[0].trim();
};

export const getClientIp = (req) => {
  // Vercel overwrites this header with the public client IP, preventing a
  // caller from supplying a spoofed value. Locally, Express's IP is used.
  if (process.env.VERCEL === '1') {
    return firstHeaderValue(
      req.headers?.['x-vercel-forwarded-for']
      || req.headers?.['x-forwarded-for']
      || req.headers?.['x-real-ip']
    ) || req.socket?.remoteAddress || 'unknown';
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
};

export const actorKeyGenerator = (req) => (
  req.userId ? `user:${req.userId}` : `ip:${getClientIp(req)}`
);

export const authKeyGenerator = (req) => {
  const email = String(req.body?.email || 'unknown')
    .trim()
    .toLowerCase()
    .slice(0, 254);

  return `ip:${getClientIp(req)}:email:${email}`;
};

const calculateRetryAfter = (req, windowMs) => {
  const resetAt = req.rateLimit?.resetTime;
  if (!(resetAt instanceof Date)) {
    return Math.ceil(windowMs / SECOND);
  }

  return Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / SECOND));
};

export const createRateLimiter = ({
  prefix,
  windowMs,
  limit,
  error,
  keyGenerator = actorKeyGenerator,
  skipSuccessfulRequests = false,
  requestWasSuccessful,
  store = new MongoRateLimitStore({ prefix }),
}) => rateLimit({
  windowMs,
  limit,
  store,
  keyGenerator,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  passOnStoreError: true,
  skip: isRateLimitingDisabled,
  skipSuccessfulRequests,
  ...(requestWasSuccessful ? { requestWasSuccessful } : {}),
  handler: (req, res) => {
    const retryAfter = calculateRetryAfter(req, windowMs);

    logger.warn('Rate limit exceeded', {
      method: req.method,
      path: req.originalUrl || req.path,
      actor: req.userId ? `user:${req.userId}` : 'anonymous',
      retryAfter,
    });

    return res.status(429).json({
      success: false,
      error,
      retryAfter,
    });
  },
});

// ===================== GENERAL API RATE LIMITER =====================
export const apiLimiter = createRateLimiter({
  prefix: 'api',
  windowMs: MINUTE,
  limit: 100,
  error: 'Too many requests. Please slow down.',
});

// ===================== AUTH RATE LIMITER (Stricter) =====================
const AUTH_FAILURE_WINDOW = 10 * MINUTE;
const AUTH_LOCKOUT_WINDOW = 2 * MINUTE;
const authFailureStore = new MongoRateLimitStore({ prefix: 'auth-failures' });
const authLockoutStore = new MongoRateLimitStore({ prefix: 'auth-lockouts' });
authFailureStore.init({ windowMs: AUTH_FAILURE_WINDOW });
authLockoutStore.init({ windowMs: AUTH_LOCKOUT_WINDOW });

// Four failed attempts are allowed in ten minutes. The fifth failed attempt
// creates a two-minute lockout. Successful requests are removed from the
// failure counter, so normal logins do not consume the allowance.
export const authLimiter = async (req, res, next) => {
  if (isRateLimitingDisabled()) return next();
  try {
    const key = authKeyGenerator(req);
    const lockout = await authLockoutStore.get(key);
    if (lockout?.resetTime > new Date()) {
    const retryAfter = Math.max(1, Math.ceil((lockout.resetTime.getTime() - Date.now()) / SECOND));
    res.set('Retry-After', String(retryAfter));
    res.set('RateLimit', `limit=4, remaining=0, reset=${Math.ceil(lockout.resetTime.getTime() / SECOND)}`);
      return res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again in 2 minutes.',
      retryAfter,
    });
    }

    const counter = await authFailureStore.increment(key);
    if (counter.totalHits > 4) {
    await authFailureStore.resetKey(key);
    const newLockout = await authLockoutStore.increment(key);
    const retryAfter = Math.max(1, Math.ceil((newLockout.resetTime.getTime() - Date.now()) / SECOND));
    res.set('Retry-After', String(retryAfter));
    res.set('RateLimit', `limit=4, remaining=0, reset=${Math.ceil(newLockout.resetTime.getTime() / SECOND)}`);
      return res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again in 2 minutes.',
      retryAfter,
    });
    }

    res.set('RateLimit', `limit=4, remaining=${Math.max(0, 4 - counter.totalHits)}, reset=${Math.ceil(counter.resetTime.getTime() / SECOND)}`);
    res.once('finish', () => {
      if (res.statusCode < 400 || res.statusCode >= 500) {
        authFailureStore.decrement(key);
      }
    });
    return next();
  } catch (error) {
    logger.error('Authentication rate limiter failed open', { error: error.message });
    return next();
  }
};

export const registrationLimiter = createRateLimiter({
  prefix: 'registration',
  windowMs: 60 * MINUTE,
  limit: 10,
  error: 'Too many registration attempts. Please try again later.',
  keyGenerator: (req) => `ip:${getClientIp(req)}`,
});

export const staffRegistrationLimiter = createRateLimiter({
  prefix: 'staff-registration',
  windowMs: 60 * MINUTE,
  limit: 5,
  error: 'Too many registration attempts. Please try again later.',
  keyGenerator: (req) => `ip:${getClientIp(req)}`,
});

export const oauthLimiter = createRateLimiter({
  prefix: 'oauth',
  windowMs: 15 * MINUTE,
  limit: 30,
  error: 'Too many sign-in attempts. Please try again later.',
  keyGenerator: (req) => `ip:${getClientIp(req)}`,
});

export const passwordResetLimiter = createRateLimiter({
  prefix: 'password-reset',
  windowMs: 15 * MINUTE,
  limit: 5,
  error: 'Too many password reset attempts. Please try again later.',
  keyGenerator: (req) => `ip:${getClientIp(req)}`,
});

// ===================== STRICT RATE LIMITER (For sensitive endpoints) =====================
export const strictLimiter = createRateLimiter({
  prefix: 'strict',
  windowMs: 5 * MINUTE,
  limit: 10,
  error: 'Too many requests. Please try again later.',
});

// ===================== REPORT RATE LIMITER =====================
export const reportLimiter = createRateLimiter({
  prefix: 'reports',
  windowMs: MINUTE,
  limit: 10,
  error: 'Too many report submissions. Please slow down.',
});

// ===================== NOTIFICATION RATE LIMITER =====================
export const notificationLimiter = createRateLimiter({
  prefix: 'notifications',
  windowMs: 5 * MINUTE,
  limit: 10,
  error: 'Too many notification requests. Please slow down.',
});

// ===================== USER MANAGEMENT RATE LIMITER =====================
export const userManagementLimiter = createRateLimiter({
  prefix: 'user-management',
  windowMs: 5 * MINUTE,
  limit: 30,
  error: 'Too many user management actions. Please slow down.',
});

export const advertisingRequestLimiter = createRateLimiter({
  prefix: 'advertising-requests',
  windowMs: 5 * MINUTE,
  limit: 10,
  error: 'Too many advertising request actions. Please slow down.',
});

export const adminWorkflowLimiter = createRateLimiter({
  prefix: 'admin-workflow',
  windowMs: 5 * MINUTE,
  limit: 30,
  error: 'Too many administrative actions. Please slow down.',
});

export const videoRefreshLimiter = createRateLimiter({
  prefix: 'video-refresh',
  windowMs: 5 * MINUTE,
  limit: 10,
  error: 'Too many video refresh requests. Please slow down.',
});

export const cleanupLimiter = createRateLimiter({
  prefix: 'notification-cleanup',
  windowMs: 15 * MINUTE,
  limit: 3,
  error: 'Too many cleanup requests. Please try again later.',
});

export default {
  apiLimiter,
  authLimiter,
  registrationLimiter,
  staffRegistrationLimiter,
  oauthLimiter,
  passwordResetLimiter,
  strictLimiter,
  reportLimiter,
  notificationLimiter,
  userManagementLimiter,
  advertisingRequestLimiter,
  adminWorkflowLimiter,
  videoRefreshLimiter,
  cleanupLimiter,
};

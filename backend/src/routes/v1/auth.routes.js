

// import express from 'express';
// import { 
//   login, 
//   register, 
//   logout, 
//   me, 
//   refreshToken
// } from '../../controllers/auth/authController.js';
// import { registerCustomer } from '../../controllers/auth/customerController.js'; // ✅ Import from customerController
// import { authenticate } from '../../middleware/auth.js';

// const router = express.Router();

// // =============================================
// // PUBLIC ROUTES (No authentication required)
// // =============================================
// router.post('/login', login);                      // ✅ ALL 3 actors can login
// router.post('/register', register);                // ✅ Media Officer (Admin only)
// router.post('/register/customer', registerCustomer); // ✅ Customer ONLY - From customerController
// router.post('/refresh', refreshToken);

// // =============================================
// // PROTECTED ROUTES (Authentication required)
// // =============================================
// router.post('/logout', authenticate, logout);
// router.get('/me', authenticate, me);

// export default router;

import express from 'express';
import { 
  login, 
  register, 
  logout, 
  me, 
  refreshToken
} from '../../controllers/auth/authController.js';
import { registerCustomer } from '../../controllers/auth/customerController.js';
import { 
  googleAuth, 
  googleAuthCustomer 
} from '../../controllers/auth/googleAuthController.js';
import { authenticate } from '../../middleware/auth.js';
import {
  authLimiter,
  registrationLimiter,
  staffRegistrationLimiter,
  oauthLimiter,
} from '../../middleware/rateLimiter.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
router.post('/login', authLimiter, login);
router.post('/register', staffRegistrationLimiter, register);
router.post('/register/customer', registrationLimiter, registerCustomer);
router.post('/refresh', refreshToken);

// =============================================
// ✅ GOOGLE AUTH ROUTES - ADDED
// =============================================
router.post('/google', oauthLimiter, googleAuth);
router.post('/google/customer', oauthLimiter, googleAuthCustomer);

// =============================================
// PROTECTED ROUTES (Authentication required)
// =============================================
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;

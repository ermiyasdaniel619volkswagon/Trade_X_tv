

import express from 'express';
import { 
  login, 
  register, 
  logout, 
  me, 
  refreshToken
} from '../../controllers/auth/authController.js';
import { registerCustomer } from '../../controllers/auth/customerController.js'; // ✅ Import from customerController
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
router.post('/login', login);                      // ✅ ALL 3 actors can login
router.post('/register', register);                // ✅ Media Officer (Admin only)
router.post('/register/customer', registerCustomer); // ✅ Customer ONLY - From customerController
router.post('/refresh', refreshToken);

// =============================================
// PROTECTED ROUTES (Authentication required)
// =============================================
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
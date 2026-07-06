
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  createRequest,
  getMyRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  submitRequest,
  getProfile,
  updateProfile,
  getLatestAgreement,
} from '../../controllers/customer/customerController.js';

const router = express.Router();

// =============================================
// ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// =============================================
router.use(authenticate);

// =============================================
// ADVERTISING REQUESTS
// =============================================
router.post('/advertising', createRequest);
router.get('/advertising', getMyRequests);
router.get('/advertising/:id', getRequestById);
router.put('/advertising/:id', updateRequest);
router.delete('/advertising/:id', deleteRequest);
router.post('/advertising/:id/submit', submitRequest);

// =============================================
// PROFILE
// =============================================
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// =============================================
// AGREEMENT - ✅ ADD THIS ROUTE
// =============================================
router.get('/agreement/latest', getLatestAgreement);

export default router;
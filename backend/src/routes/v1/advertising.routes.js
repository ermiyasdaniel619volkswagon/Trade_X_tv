import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import {
  getAllRequests,
  getRequestDetails,
  reviewRequest,
  updateProductionStatus,
  getRequestStats,
} from '../../controllers/admin/adminController.js';
import { adminWorkflowLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// =============================================
// ALL ROUTES REQUIRE AUTHENTICATION + ADMIN/SUPERVISOR ROLE
// =============================================
router.use(authenticate);
router.use(authorize('admin', 'supervisor'));

// =============================================
// ADVERTISING REQUESTS MANAGEMENT
// =============================================

// Get all requests with pagination & filters
router.get('/advertising', getAllRequests);

// Get request statistics
router.get('/advertising/stats', getRequestStats);

// Get single request details
router.get('/advertising/:id', getRequestDetails);

// Review request (approve/reject/revision)
router.put('/advertising/:id/review', adminWorkflowLimiter, reviewRequest);

// Update production status
router.put('/advertising/:id/production', adminWorkflowLimiter, updateProductionStatus);

export default router;



import express from 'express';
import { authenticate, requireSupervisor } from '../../middleware/auth.js';
import {
  getAllRequests,
  getRequestDetails,
  reviewRequest,
  updateProductionStatus,  // ✅ ADD THIS IMPORT
  getRequestStats,
} from '../../controllers/admin/adminCustomerController.js';
import {
  getAllTemplates,
  getDefaultTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../../controllers/admin/agreementController.js';

const router = express.Router();

// =============================================
// ALL ROUTES REQUIRE SUPERVISOR AUTHENTICATION
// =============================================
router.use(authenticate);
router.use(requireSupervisor);

// =============================================
// REQUESTS MANAGEMENT
// =============================================
router.get('/advertising', getAllRequests);
router.get('/advertising/stats', getRequestStats);
router.get('/advertising/:id', getRequestDetails);
router.put('/advertising/:id/review', reviewRequest);
router.put('/advertising/:id/production', updateProductionStatus);  // ✅ ADD THIS ROUTE

// =============================================
// AGREEMENT TEMPLATES
// =============================================
router.get('/agreement/templates', getAllTemplates);
router.get('/agreement/templates/default', getDefaultTemplate);
router.post('/agreement/templates', createTemplate);
router.put('/agreement/templates/:id', updateTemplate);
router.delete('/agreement/templates/:id', deleteTemplate);

export default router;
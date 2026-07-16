

import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  toggleCustomerStatus,
  deleteCustomer,
  getCustomerStatistics,
  getCustomerRequests,
  sendCustomerNotification,
  exportCustomers,
} from '../../controllers/admin/adminCustomerController.js';
import {
  notificationLimiter,
  userManagementLimiter,
} from '../../middleware/rateLimiter.js';

const router = express.Router();

// =============================================
// ALL ROUTES REQUIRE AUTHENTICATION + ADMIN/SUPERVISOR ROLE
// =============================================
router.use(authenticate);
router.use(authorize('admin', 'supervisor'));

// =============================================
// CUSTOMER MANAGEMENT
// =============================================
router.get('/customers', getAllCustomers);
router.get('/customers/statistics', getCustomerStatistics);
router.get('/customers/export', exportCustomers);
router.get('/customers/:id', getCustomerById);
router.put('/customers/:id', userManagementLimiter, updateCustomer);
router.patch('/customers/:id/toggle', userManagementLimiter, toggleCustomerStatus);
router.delete('/customers/:id', userManagementLimiter, deleteCustomer);

// =============================================
// CUSTOMER REQUESTS
// =============================================
router.get('/customers/:id/requests', getCustomerRequests);

// =============================================
// NOTIFICATIONS
// =============================================
router.post('/customers/:id/notify', notificationLimiter, sendCustomerNotification);

export default router;


import express from 'express';
import {
  getDashboardStats,
  reviewReport,
  getPendingReports,
  getAllReports,
  createUser,
  updateUser,
  deleteUser,
  getTeamMembers,
  getUserStats,
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  getReportDetails,
} from '../../controllers/admin/adminController.js';
import { authenticate, requireSupervisor } from '../../middleware/auth.js';
import {
  adminWorkflowLimiter,
  userManagementLimiter,
} from '../../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSupervisor);

router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/pending', getPendingReports);
router.get('/reports/all', getAllReports);
router.get('/reports/:id/details', getReportDetails);
router.put('/reports/:id/review', adminWorkflowLimiter, reviewReport);

router.get('/users', getAllUsers);
router.get('/users/team', getTeamMembers);
router.get('/users/:id/stats', getUserStats);
router.post('/users', userManagementLimiter, createUser);
router.put('/users/:id', userManagementLimiter, updateUser);
router.put('/users/:id/role', userManagementLimiter, updateUserRole);
router.put('/users/:id/toggle-active', userManagementLimiter, toggleUserActive);
router.delete('/users/:id', userManagementLimiter, deleteUser);

export default router;

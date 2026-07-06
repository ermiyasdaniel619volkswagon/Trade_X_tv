
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

const router = express.Router();

router.use(authenticate);
router.use(requireSupervisor);

router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/pending', getPendingReports);
router.get('/reports/all', getAllReports);
router.get('/reports/:id/details', getReportDetails);
router.put('/reports/:id/review', reviewReport);

router.get('/users', getAllUsers);
router.get('/users/team', getTeamMembers);
router.get('/users/:id/stats', getUserStats);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-active', toggleUserActive);
router.delete('/users/:id', deleteUser);

export default router;
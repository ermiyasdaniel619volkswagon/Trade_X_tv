
import express from 'express';
import { authenticate, requireSupervisor } from '../../middleware/auth.js';
import {
  getAllNews,
  getPublicNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsActive,
} from '../../controllers/admin/newsController.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
router.get('/public', getPublicNews);

// =============================================
// ADMIN ROUTES (Authentication + Supervisor required)
// =============================================
router.use(authenticate);
router.use(requireSupervisor);

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);
router.put('/:id/toggle-active', toggleNewsActive);

export default router;
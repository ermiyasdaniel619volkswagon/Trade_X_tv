
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  getAllHeroVideos,
  getHeroVideoById,
  getPublicHeroVideos,
  createHeroVideo,
  updateHeroVideo,
  deleteHeroVideo,
  reorderHeroVideos,
  toggleHeroActive,
} from '../../controllers/admin/heroController.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
// These routes are accessible without a token
router.get('/public', getPublicHeroVideos);
router.get('/public/:id', getHeroVideoById);

// =============================================
// ADMIN ROUTES (Authentication required)
// =============================================
// These routes require authentication
router.use(authenticate);

router.get('/', getAllHeroVideos);
router.get('/:id', getHeroVideoById);
router.post('/', createHeroVideo);
router.put('/:id', updateHeroVideo);
router.delete('/:id', deleteHeroVideo);
router.post('/reorder', reorderHeroVideos);
router.put('/:id/toggle-active', toggleHeroActive);

export default router;
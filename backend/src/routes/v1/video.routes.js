
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  getAllVideos,
  getVideoById,
  getFeaturedVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
  toggleFeatured,
  toggleActive,
  refreshVideoData,
  incrementVideoViews,
} from '../../controllers/admin/videoController.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
router.get('/public/featured', getFeaturedVideos);
router.get('/public', getAllVideos);
router.post('/public/:videoId/view', incrementVideoViews);

// =============================================
// ADMIN ROUTES (Authentication required)
// =============================================
router.use(authenticate);

router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);
router.post('/reorder', reorderVideos);
router.put('/:id/toggle-featured', toggleFeatured);
router.put('/:id/toggle-active', toggleActive);
router.post('/:id/refresh', refreshVideoData);

export default router;
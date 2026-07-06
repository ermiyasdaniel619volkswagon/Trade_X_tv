import express from 'express';
import { authenticate, requireSupervisor } from '../../middleware/auth.js';
import {
  getAllBlogs,
  getPublicBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogActive,
  toggleBlogFeatured,
  getBlogCategories,
} from '../../controllers/admin/blogController.js';

const router = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================
router.get('/public', getPublicBlogs);
router.get('/categories', getBlogCategories);

// =============================================
// ADMIN ROUTES (Authentication + Supervisor required)
// =============================================
router.use(authenticate);
router.use(requireSupervisor);

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.put('/:id/toggle-active', toggleBlogActive);
router.put('/:id/toggle-featured', toggleBlogFeatured);

export default router;

import express from 'express';
import { 
  createReport, 
  getMyReports, 
  getReportById, 
  getTodayReport,
  getStats,
  deleteReport
} from '../../controllers/report/reportController.js';
import { authenticate } from '../../middleware/auth.js';
import { reportLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

router.post('/', reportLimiter, createReport);
router.get('/my', getMyReports);
router.get('/today', getTodayReport);
router.get('/stats', getStats);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

export default router;

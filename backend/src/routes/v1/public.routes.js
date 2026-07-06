
import express from 'express';
import Video from '../../models/Video.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// =============================================
// GET all active videos for public display
// =============================================
router.get('/videos', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    
    let videosQuery = Video.find(query).sort({ displayOrder: 1, createdAt: -1 });
    
    if (limit) {
      videosQuery = videosQuery.limit(parseInt(limit));
    }
    
    const videos = await videosQuery;
    
    return res.status(200).json({
      success: true,
      videos,
      count: videos.length,
    });
  } catch (error) {
    logger.error('Get public videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET featured videos for hero banner
// =============================================
router.get('/videos/featured', async (req, res) => {
  try {
    const videos = await Video.getFeatured();
    
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    logger.error('Get featured videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET single video by videoId
// =============================================
router.get('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const video = await Video.findOne({ videoId, isActive: true });
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    logger.error('Get public video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
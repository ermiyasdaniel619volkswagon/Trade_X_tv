
import HeroVideo from '../../models/HeroVideo.js';
import { logger } from '../../utils/logger.js';
import { extractVideoId, isValidVideoId } from '../../services/youtubeService.js';

// =============================================
// GET all hero videos
// =============================================
export const getAllHeroVideos = async (req, res) => {
  try {
    const videos = await HeroVideo.find()
      .sort({ displayOrder: 1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      videos,
      count: videos.length,
    });
  } catch (error) {
    logger.error('Get all hero videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET single hero video by ID
// =============================================
export const getHeroVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await HeroVideo.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Hero video not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    logger.error('Get hero video by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// CREATE hero video
// =============================================
export const createHeroVideo = async (req, res) => {
  try {
    const { videoId, title, description, badge, color, colorLight, displayOrder } = req.body;
    
    let finalVideoId = videoId;
    if (videoId) {
      const extractedId = extractVideoId(videoId);
      if (extractedId) {
        finalVideoId = extractedId;
      }
    }
    
    if (!finalVideoId || !isValidVideoId(finalVideoId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube video ID. Must be 11 characters or a valid YouTube URL.',
      });
    }
    
    const existingVideo = await HeroVideo.findOne({ videoId: finalVideoId });
    if (existingVideo) {
      return res.status(409).json({
        success: false,
        error: 'Hero video with this ID already exists',
      });
    }
    
    let finalDisplayOrder = displayOrder;
    if (finalDisplayOrder === undefined) {
      const lastVideo = await HeroVideo.findOne().sort({ displayOrder: -1 });
      finalDisplayOrder = lastVideo ? lastVideo.displayOrder + 1 : 0;
    }
    
    const video = new HeroVideo({
      videoId: finalVideoId,
      title: title || 'Untitled Video',
      description: description || '',
      badge: badge || '',
      color: color || '#1A3258',
      colorLight: colorLight || '#2A4A78',
      displayOrder: finalDisplayOrder,
      isActive: true,
    });
    
    await video.save();
    
    logger.info(`New hero video created: ${video.title} (${video.videoId})`);
    
    return res.status(201).json({
      success: true,
      message: 'Hero video added successfully',
      video,
    });
  } catch (error) {
    logger.error('Create hero video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// UPDATE hero video
// =============================================
export const updateHeroVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const video = await HeroVideo.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Hero video not found',
      });
    }
    
    if (updates.videoId && updates.videoId !== video.videoId) {
      if (!isValidVideoId(updates.videoId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid YouTube video ID format',
        });
      }
      
      const existingVideo = await HeroVideo.findOne({ videoId: updates.videoId, _id: { $ne: id } });
      if (existingVideo) {
        return res.status(409).json({
          success: false,
          error: 'Hero video with this ID already exists',
        });
      }
    }
    
    Object.assign(video, updates);
    await video.save();
    
    logger.info(`Hero video updated: ${video.title} (${video.videoId})`);
    
    return res.status(200).json({
      success: true,
      message: 'Hero video updated successfully',
      video,
    });
  } catch (error) {
    logger.error('Update hero video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE hero video
// =============================================
export const deleteHeroVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await HeroVideo.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Hero video not found',
      });
    }
    
    await video.deleteOne();
    
    logger.info(`Hero video deleted: ${video.title} (${video.videoId})`);
    
    return res.status(200).json({
      success: true,
      message: 'Hero video deleted successfully',
    });
  } catch (error) {
    logger.error('Delete hero video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// REORDER hero videos
// =============================================
export const reorderHeroVideos = async (req, res) => {
  try {
    const { videoOrders } = req.body;
    
    if (!videoOrders || !Array.isArray(videoOrders)) {
      return res.status(400).json({
        success: false,
        error: 'videoOrders array is required',
      });
    }
    
    const updates = videoOrders.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { displayOrder },
      },
    }));
    
    await HeroVideo.bulkWrite(updates);
    
    logger.info(`Reordered ${videoOrders.length} hero videos`);
    
    return res.status(200).json({
      success: true,
      message: 'Hero videos reordered successfully',
    });
  } catch (error) {
    logger.error('Reorder hero videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE active status
// =============================================
export const toggleHeroActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await HeroVideo.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Hero video not found',
      });
    }
    
    video.isActive = !video.isActive;
    await video.save();
    
    return res.status(200).json({
      success: true,
      message: `Hero video ${video.isActive ? 'activated' : 'deactivated'} successfully`,
      video,
    });
  } catch (error) {
    logger.error('Toggle hero active error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET public hero videos
// =============================================
export const getPublicHeroVideos = async (req, res) => {
  try {
    const videos = await HeroVideo.getActive();
    
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    logger.error('Get public hero videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
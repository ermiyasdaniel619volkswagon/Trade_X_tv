
import Video from '../../models/Video.js';
import { logger } from '../../utils/logger.js';
import { fetchYouTubeVideoData, extractVideoId, isValidVideoId } from '../../services/youtubeService.js';

// =============================================
// GET all videos
// =============================================
export const getAllVideos = async (req, res) => {
  try {
    const { category, isActive, isFeatured } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    
    const videos = await Video.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      videos,
      count: videos.length,
    });
  } catch (error) {
    logger.error('Get all videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET single video by ID
// =============================================
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
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
    logger.error('Get video by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET featured videos (for hero banner)
// =============================================
export const getFeaturedVideos = async (req, res) => {
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
};

// =============================================
// CREATE new video
// =============================================
export const createVideo = async (req, res) => {
  try {
    const { videoId, title, description, channel, category, duration, isFeatured, displayOrder } = req.body;
    
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
    
    const existingVideo = await Video.findOne({ videoId: finalVideoId });
    if (existingVideo) {
      return res.status(409).json({
        success: false,
        error: 'Video with this ID already exists',
      });
    }
    
    let videoData = { title, channel, duration, views: 0 };
    
    if (!title) {
      const fetchedData = await fetchYouTubeVideoData(finalVideoId);
      if (fetchedData.success) {
        videoData.title = fetchedData.title || 'Untitled Video';
        videoData.channel = fetchedData.channel || 'TradeExTV Official';
        videoData.duration = fetchedData.duration || '0:00';
        videoData.views = fetchedData.views || 0;
      } else {
        videoData.title = title || 'Untitled Video';
        videoData.channel = channel || 'TradeExTV Official';
        videoData.duration = duration || '0:00';
        videoData.views = 0;
      }
    }
    
    let finalDisplayOrder = displayOrder;
    if (finalDisplayOrder === undefined) {
      const lastVideo = await Video.findOne().sort({ displayOrder: -1 });
      finalDisplayOrder = lastVideo ? lastVideo.displayOrder + 1 : 0;
    }
    
    const video = new Video({
      videoId: finalVideoId,
      title: videoData.title,
      description: description || '',
      channel: videoData.channel,
      category: category || 'General',
      duration: videoData.duration,
      views: videoData.views,
      isFeatured: isFeatured || false,
      isActive: true,
      displayOrder: finalDisplayOrder,
    });
    
    await video.save();
    
    logger.info(`New video created: ${video.title} (${video.videoId})`);
    
    return res.status(201).json({
      success: true,
      message: 'Video added successfully',
      video,
    });
  } catch (error) {
    logger.error('Create video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// UPDATE video
// =============================================
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    if (updates.videoId && updates.videoId !== video.videoId) {
      if (!isValidVideoId(updates.videoId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid YouTube video ID format',
        });
      }
      
      const existingVideo = await Video.findOne({ videoId: updates.videoId, _id: { $ne: id } });
      if (existingVideo) {
        return res.status(409).json({
          success: false,
          error: 'Video with this ID already exists',
        });
      }
    }
    
    Object.assign(video, updates);
    await video.save();
    
    logger.info(`Video updated: ${video.title} (${video.videoId})`);
    
    return res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      video,
    });
  } catch (error) {
    logger.error('Update video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE video
// =============================================
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    await video.deleteOne();
    
    logger.info(`Video deleted: ${video.title} (${video.videoId})`);
    
    return res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    logger.error('Delete video error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// REORDER videos
// =============================================
export const reorderVideos = async (req, res) => {
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
    
    await Video.bulkWrite(updates);
    
    logger.info(`Reordered ${videoOrders.length} videos`);
    
    return res.status(200).json({
      success: true,
      message: 'Videos reordered successfully',
    });
  } catch (error) {
    logger.error('Reorder videos error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE featured status
// =============================================
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    video.isFeatured = !video.isFeatured;
    await video.save();
    
    return res.status(200).json({
      success: true,
      message: `Video ${video.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      video,
    });
  } catch (error) {
    logger.error('Toggle featured error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE active status
// =============================================
export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    video.isActive = !video.isActive;
    await video.save();
    
    return res.status(200).json({
      success: true,
      message: `Video ${video.isActive ? 'activated' : 'deactivated'} successfully`,
      video,
    });
  } catch (error) {
    logger.error('Toggle active error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// REFRESH video data from YouTube
// =============================================
export const refreshVideoData = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    const videoData = await fetchYouTubeVideoData(video.videoId);
    
    if (videoData.success) {
      video.title = videoData.title || video.title;
      video.channel = videoData.channel || video.channel;
      video.duration = videoData.duration || video.duration;
      video.views = videoData.views || 0;
      await video.save();
      
      return res.status(200).json({
        success: true,
        message: 'Video data refreshed successfully',
        video,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: videoData.error || 'Failed to fetch video data from YouTube',
      });
    }
  } catch (error) {
    logger.error('Refresh video data error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// INCREMENT VIDEO VIEWS
// =============================================
export const incrementVideoViews = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Video ID is required',
      });
    }
    
    const video = await Video.findOne({ videoId });
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }
    
    video.views = (video.views || 0) + 1;
    await video.save();
    
    return res.status(200).json({
      success: true,
      views: video.views,
      message: 'View count incremented',
    });
  } catch (error) {
    logger.error('Increment video views error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
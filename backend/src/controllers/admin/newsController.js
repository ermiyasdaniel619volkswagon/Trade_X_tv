
import News from '../../models/News.js';
import { logger } from '../../utils/logger.js';

// =============================================
// GET ALL NEWS (Admin)
// =============================================
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      news,
      count: news.length,
    });
  } catch (error) {
    logger.error('Get all news error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET PUBLIC NEWS (No Auth Required)
// =============================================
export const getPublicNews = async (req, res) => {
  try {
    const news = await News.find({ isActive: true }).sort({ date: -1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      news,
      count: news.length,
    });
  } catch (error) {
    logger.error('Get public news error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET SINGLE NEWS BY ID
// =============================================
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    logger.error('Get news by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// CREATE NEWS (Supervisor Only)
// =============================================
export const createNews = async (req, res) => {
  try {
    const { title, category, tag, excerpt, content, image, author, date } = req.body;
    const userId = req.userId;
    
    // Validate required fields
    if (!title || !category || !excerpt || !content || !author) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: title, category, excerpt, content, author',
      });
    }
    
    const news = new News({
      title: title.trim(),
      category: category.trim(),
      tag: tag || category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
      author: author.trim(),
      date: date || new Date(),
      createdBy: userId,
      isActive: true,
    });
    
    await news.save();
    
    logger.info(`News created by user ${userId}: ${news.title}`);
    
    return res.status(201).json({
      success: true,
      message: 'News created successfully',
      news,
    });
  } catch (error) {
    logger.error('Create news error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
    });
  }
};

// =============================================
// UPDATE NEWS (Supervisor Only)
// =============================================
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }
    
    // Update only provided fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id' && key !== 'createdBy') {
        news[key] = updates[key];
      }
    });
    
    await news.save();
    
    logger.info(`News updated: ${news.title}`);
    
    return res.status(200).json({
      success: true,
      message: 'News updated successfully',
      news,
    });
  } catch (error) {
    logger.error('Update news error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE NEWS (Supervisor Only)
// =============================================
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }
    
    await news.deleteOne();
    
    logger.info(`News deleted: ${news.title}`);
    
    return res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    logger.error('Delete news error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE NEWS ACTIVE STATUS (Supervisor Only)
// =============================================
export const toggleNewsActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }
    
    news.isActive = !news.isActive;
    await news.save();
    
    return res.status(200).json({
      success: true,
      message: `News ${news.isActive ? 'activated' : 'deactivated'} successfully`,
      news,
    });
  } catch (error) {
    logger.error('Toggle news active error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
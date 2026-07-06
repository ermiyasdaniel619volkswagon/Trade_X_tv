
import Blog from '../../models/Blog.js';
import { logger } from '../../utils/logger.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================================
// HELPER: Extract public ID from Cloudinary URL
// =============================================
const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    const publicIdParts = parts.slice(uploadIndex + 2);
    const publicId = publicIdParts.join('/').replace(/\.[^.]+$/, '');
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// =============================================
// HELPER: Delete image from Cloudinary
// =============================================
const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) return { success: false, message: 'Invalid Cloudinary URL' };
    
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

// =============================================
// GET ALL BLOGS (Admin)
// =============================================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ date: -1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    logger.error('Get all blogs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET PUBLIC BLOGS (No Auth Required)
// =============================================
export const getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true })
      .sort({ date: -1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    logger.error('Get public blogs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET SINGLE BLOG BY ID
// =============================================
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    logger.error('Get blog by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// CREATE BLOG (Supervisor Only)
// =============================================
export const createBlog = async (req, res) => {
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
    
    const blog = new Blog({
      title: title.trim(),
      category: category.trim(),
      tag: tag || category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: image || 'https://picsum.photos/seed/blog/600/400',
      author: author.trim(),
      date: date || new Date(),
      createdBy: userId,
      isActive: true,
    });
    
    await blog.save();
    
    logger.info(`Blog created by user ${userId}: ${blog.title}`);
    
    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    logger.error('Create blog error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
    });
  }
};

// =============================================
// UPDATE BLOG (Supervisor Only)
// =============================================
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }
    
    // If image is being updated, delete old image from Cloudinary
    if (updates.image && updates.image !== blog.image && blog.image && blog.image.includes('cloudinary')) {
      await deleteImageFromCloudinary(blog.image);
    }
    
    // Update only provided fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id' && key !== 'createdBy') {
        blog[key] = updates[key];
      }
    });
    
    await blog.save();
    
    logger.info(`Blog updated: ${blog.title}`);
    
    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    logger.error('Update blog error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE BLOG (Supervisor Only)
// =============================================
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (blog.image && blog.image.includes('cloudinary')) {
      await deleteImageFromCloudinary(blog.image);
    }
    
    await blog.deleteOne();
    
    logger.info(`Blog deleted: ${blog.title}`);
    
    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    logger.error('Delete blog error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE BLOG ACTIVE STATUS (Supervisor Only)
// =============================================
export const toggleBlogActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }
    
    blog.isActive = !blog.isActive;
    await blog.save();
    
    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isActive ? 'activated' : 'deactivated'} successfully`,
      blog,
    });
  } catch (error) {
    logger.error('Toggle blog active error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE BLOG FEATURED STATUS (Supervisor Only)
// =============================================
export const toggleBlogFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }
    
    blog.isFeatured = !blog.isFeatured;
    await blog.save();
    
    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      blog,
    });
  } catch (error) {
    logger.error('Toggle blog featured error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET BLOG CATEGORIES
// =============================================
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    logger.error('Get blog categories error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
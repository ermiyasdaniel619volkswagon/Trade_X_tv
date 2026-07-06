import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    default: 'General',
  },
  tag: {
    type: String,
    trim: true,
    default: 'Blog',
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://picsum.photos/seed/blog/600/400',
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

blogSchema.index({ category: 1 });
blogSchema.index({ date: -1 });
blogSchema.index({ isActive: 1 });
blogSchema.index({ isFeatured: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
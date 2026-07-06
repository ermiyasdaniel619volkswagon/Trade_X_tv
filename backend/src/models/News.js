
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
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
    default: 'News',
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
    default: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

newsSchema.index({ category: 1 });
newsSchema.index({ date: -1 });
newsSchema.index({ isActive: 1 });

const News = mongoose.model('News', newsSchema);

export default News;
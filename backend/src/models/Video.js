
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: [true, 'YouTube video ID is required'],
    unique: true, // ✅ This creates the unique index
    trim: true,
    match: [/^[a-zA-Z0-9_-]{11}$/, 'Invalid YouTube video ID format'],
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  channel: {
    type: String,
    trim: true,
    default: 'Tradex TV Official',
  },
  category: {
    type: String,
    enum: ['Company', 'Behind the Scenes', 'Tutorial', 'Equipment', 'Testimonials', 'Masterclass', 'Strategy', 'General'],
    default: 'General',
  },
  duration: {
    type: String,
    trim: true,
    default: '0:00',
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// ✅ Only add indexes for fields that don't already have them
// videoId already has unique: true, so we don't need to index it again
videoSchema.index({ isActive: 1 });
videoSchema.index({ isFeatured: 1 });
videoSchema.index({ displayOrder: 1 });
videoSchema.index({ category: 1 });

videoSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(6);
};

videoSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 });
};

videoSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 });
};

const Video = mongoose.model('Video', videoSchema);

export default Video;
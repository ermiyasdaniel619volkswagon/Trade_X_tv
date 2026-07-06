

import mongoose from 'mongoose';

const heroVideoSchema = new mongoose.Schema({
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
  badge: {
    type: String,
    enum: ['Live Now', 'Featured', 'Premium', 'New Release', 'Trending', 'Exclusive', ''],
    default: '',
  },
  color: {
    type: String,
    default: '#1A3258',
  },
  colorLight: {
    type: String,
    default: '#2A4A78',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// ✅ Only add indexes for fields that don't already have them
// videoId already has unique: true, so we don't need to index it again
heroVideoSchema.index({ isActive: 1 });
heroVideoSchema.index({ displayOrder: 1 });

heroVideoSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 });
};

const HeroVideo = mongoose.model('HeroVideo', heroVideoSchema);

export default HeroVideo;
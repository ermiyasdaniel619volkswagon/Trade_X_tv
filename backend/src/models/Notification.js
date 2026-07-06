
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    enum: ['announcement', 'system', 'reminder', 'feedback', 'alert'],
    default: 'announcement',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'media_officer', 'supervisor', 'specific'],
    default: 'all',
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  deleteAfter: {
    type: String,
    enum: ['20min', '1hour', '6hours', '12hours', '1day', '3days', '7days', '14days', '30days', 'never'],
    default: '30days',
  },
  customDeleteDate: {
    type: Date,
    default: null,
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    // ✅ REMOVE index: true from here - we'll use schema.index() below
  },
}, {
  timestamps: true,
});

// ✅ All indexes defined here to avoid duplication
notificationSchema.index({ createdAt: 1 }); // ✅ Only defined once
notificationSchema.index({ isActive: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ targetAudience: 1 });
notificationSchema.index({ deleteAfter: 1 });
notificationSchema.index({ customDeleteDate: 1 });

// =============================================
// STATIC METHODS
// =============================================

notificationSchema.statics.getDeleteTimeMap = function() {
  return {
    '20min': 20 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
    '6hours': 6 * 60 * 60 * 1000,
    '12hours': 12 * 60 * 60 * 1000,
    '1day': 24 * 60 * 60 * 1000,
    '3days': 3 * 24 * 60 * 60 * 1000,
    '7days': 7 * 24 * 60 * 60 * 1000,
    '14days': 14 * 24 * 60 * 60 * 1000,
    '30days': 30 * 24 * 60 * 60 * 1000,
    'never': Infinity,
  };
};

notificationSchema.statics.calculateDeleteDate = function(deleteAfter) {
  const timeMap = this.getDeleteTimeMap();
  const ms = timeMap[deleteAfter] || timeMap['30days'];
  
  if (deleteAfter === 'never' || ms === Infinity) {
    return null;
  }
  
  return new Date(Date.now() + ms);
};

notificationSchema.statics.cleanupOldNotifications = async function() {
  try {
    const now = new Date();
    const timeMap = this.getDeleteTimeMap();
    
    let totalDeleted = 0;
    
    for (const [key, ms] of Object.entries(timeMap)) {
      if (key === 'never' || ms === Infinity) continue;
      
      const cutoffDate = new Date(now - ms);
      
      const result = await this.deleteMany({
        deleteAfter: key,
        isActive: true,
        createdAt: { $lt: cutoffDate },
        'readBy.0': { $exists: true },
      });
      
      totalDeleted += result.deletedCount;
    }
    
    const customResult = await this.deleteMany({
      customDeleteDate: { $ne: null, $lt: now },
      isActive: true,
    });
    
    totalDeleted += customResult.deletedCount;
    
    console.log(`🧹 Cleaned up ${totalDeleted} old notifications`);
    return { deletedCount: totalDeleted };
  } catch (error) {
    console.error('Error cleaning old notifications:', error);
    throw error;
  }
};

notificationSchema.statics.updateDeletePreference = async function(notificationId, deleteAfter) {
  const validOptions = Object.keys(this.getDeleteTimeMap());
  if (!validOptions.includes(deleteAfter)) {
    throw new Error('Invalid delete preference');
  }
  
  const customDeleteDate = this.calculateDeleteDate(deleteAfter);
  
  return this.findByIdAndUpdate(
    notificationId,
    {
      deleteAfter,
      customDeleteDate,
    },
    { new: true }
  );
};

notificationSchema.statics.getNotificationStats = async function() {
  try {
    const total = await this.countDocuments({ isActive: true });
    const read = await this.countDocuments({
      isActive: true,
      'readBy.0': { $exists: true },
    });
    const unread = await this.countDocuments({
      isActive: true,
      'readBy.0': { $exists: false },
    });
    
    return { total, read, unread };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    throw error;
  }
};

notificationSchema.statics.findActive = function() {
  return this.find({
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } },
    ],
  }).sort({ priority: -1, createdAt: -1 });
};

notificationSchema.statics.findUnreadByUser = function(userId) {
  return this.find({
    isActive: true,
    'readBy.userId': { $ne: userId },
    $or: [
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } },
    ],
    $or: [
      { targetAudience: 'all' },
      { targetAudience: { $exists: false } },
      { targetUsers: userId },
    ],
  }).sort({ priority: -1, createdAt: -1 });
};

notificationSchema.statics.markAsRead = function(notificationId, userId) {
  return this.findByIdAndUpdate(
    notificationId,
    {
      $addToSet: {
        readBy: {
          userId: userId,
          readAt: new Date(),
        },
      },
    },
    { new: true }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
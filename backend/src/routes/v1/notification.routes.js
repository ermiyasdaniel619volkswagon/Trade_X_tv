
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import Notification from '../../models/Notification.js';
import { cleanupOldNotifications } from '../../services/cleanupService.js';
import {
  notificationLimiter,
  cleanupLimiter,
} from '../../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

// =============================================
// GET all active notifications
// =============================================
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    
    const query = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
    };

    // Both roles see their notifications
    if (userRole === 'supervisor') {
      query.$or = [
        { targetAudience: 'all' },
        { targetUsers: userId },
      ];
      // Supervisors don't see their own sent notifications
      query.sentBy = { $ne: userId };
    } else {
      query.$or = [
        { targetAudience: 'all' },
        { targetUsers: userId },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('sentBy', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET ALL notifications - for management page
// =============================================
router.get('/all', async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    
    let query = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
    };

    if (userRole === 'supervisor') {
      query = {
        ...query,
        $or: [
          { targetAudience: 'all' },
          { targetUsers: userId },
        ],
        sentBy: { $ne: userId },
      };
    } else {
      // Media Officers can see ALL notifications
      query = {
        ...query,
        $or: [
          { targetAudience: 'all' },
          { targetUsers: userId },
        ],
      };
    }

    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('sentBy', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET unread notifications only
// =============================================
router.get('/unread', async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    
    const query = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
      'readBy.userId': { $ne: userId },
    };

    if (userRole === 'supervisor') {
      query.$or = [
        { targetAudience: 'all' },
        { targetUsers: userId },
      ];
      query.sentBy = { $ne: userId };
    } else {
      query.$or = [
        { targetAudience: 'all' },
        { targetUsers: userId },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('sentBy', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET notification stats
// =============================================
router.get('/stats', async (req, res) => {
  try {
    const stats = await Notification.getNotificationStats();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// GET available delete preferences
// =============================================
router.get('/delete-preferences', async (req, res) => {
  try {
    const timeMap = Notification.getDeleteTimeMap();
    const preferences = Object.keys(timeMap).map(key => ({
      value: key,
      label: key === 'never' ? 'Never Delete' : 
             key === '20min' ? '20 Minutes' :
             key === '1hour' ? '1 Hour' :
             key === '6hours' ? '6 Hours' :
             key === '12hours' ? '12 Hours' :
             key === '1day' ? '1 Day' :
             key === '3days' ? '3 Days' :
             key === '7days' ? '7 Days' :
             key === '14days' ? '14 Days' :
             key === '30days' ? '30 Days' : key,
      timeInMs: timeMap[key],
    }));
    return res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Get delete preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// PUT - Update notification delete preference
// =============================================
router.put('/:id/delete-preference', async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteAfter } = req.body;
    const userId = req.userId;

    if (!deleteAfter) {
      return res.status(400).json({
        success: false,
        error: 'Delete preference is required',
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    // ANY user can update preference for ANY notification they can see
    // Media Officers can update ANY notification (public or personal)
    // Supervisors can update ANY notification
    // Only restriction: cannot update notifications they sent to themselves
    if (notification.sentBy.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Cannot update preference for notifications you sent',
      });
    }

    const updated = await Notification.updateDeletePreference(id, deleteAfter);

    return res.status(200).json({
      success: true,
      message: `Delete preference updated to ${deleteAfter}`,
      notification: updated,
    });
  } catch (error) {
    console.error('Update delete preference error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

// =============================================
// POST - Create a new notification
// =============================================
router.post('/', notificationLimiter, async (req, res) => {
  try {
    const { title, message, priority, type, targetAudience, targetUsers, expiresAt, deleteAfter } = req.body;
    const sentBy = req.userId;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required',
      });
    }

    const user = req.user;
    if (user.role !== 'supervisor') {
      return res.status(403).json({
        success: false,
        error: 'Only supervisors can create announcements',
      });
    }

    const customDeleteDate = deleteAfter ? Notification.calculateDeleteDate(deleteAfter) : null;

    const notification = new Notification({
      title: title.trim(),
      message: message.trim(),
      type: type || 'announcement',
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      targetUsers: targetUsers || [],
      sentBy: sentBy,
      isActive: true,
      expiresAt: expiresAt || null,
      deleteAfter: deleteAfter || '30days',
      customDeleteDate: customDeleteDate,
    });

    await notification.save();

    return res.status(201).json({
      success: true,
      message: 'Announcement sent successfully',
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// PUT - Mark notification as read
// =============================================
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    const alreadyRead = notification.readBy?.some(r => r.userId.toString() === userId.toString());
    if (!alreadyRead) {
      notification.readBy.push({
        userId: userId,
        readAt: new Date(),
      });
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// DELETE - Permanently delete a notification
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    // =============================================
    // PERMISSION: ANY user can delete ANY notification
    // EXCEPT: Cannot delete notifications they sent to themselves
    // =============================================
    
    // Check if user sent this notification to themselves
    if (notification.sentBy.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete notifications you sent',
      });
    }

    // ANY user can delete ANY notification they have access to
    // Media Officers can delete public announcements too
    // Supervisors can delete any notification
    await notification.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// =============================================
// POST - Manually trigger cleanup (admin only)
// =============================================
router.post('/cleanup', cleanupLimiter, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'supervisor') {
      return res.status(403).json({
        success: false,
        error: 'Only supervisors can trigger cleanup',
      });
    }

    const result = await cleanupOldNotifications();
    
    return res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old notifications`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;

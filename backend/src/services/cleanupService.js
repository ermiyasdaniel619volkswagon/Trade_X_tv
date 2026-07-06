
import Notification from '../models/Notification.js';
import { logger } from '../utils/logger.js';

export const cleanupOldNotifications = async () => {
  try {
    const statsBefore = await Notification.getNotificationStats();
    logger.info(`📊 Before cleanup: ${statsBefore.total} total notifications`);

    const result = await Notification.cleanupOldNotifications();
    
    const statsAfter = await Notification.getNotificationStats();
    logger.info(`📊 After cleanup: ${statsAfter.total} total notifications remaining`);
    logger.info(`🧹 Cleaned up ${result.deletedCount} old notifications`);
    
    return result;
  } catch (error) {
    logger.error('❌ Cleanup service error:', error);
    // Don't throw, just log the error
    return { deletedCount: 0, error: error.message };
  }
};

export const scheduleCleanup = () => {
  // Run cleanup on startup
  setTimeout(async () => {
    try {
      await cleanupOldNotifications();
    } catch (error) {
      logger.error('❌ Initial cleanup failed:', error);
    }
  }, 10000); // Wait 10 seconds after server starts

  // Schedule cleanup every 5 minutes
  const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  setInterval(async () => {
    try {
      await cleanupOldNotifications();
    } catch (error) {
      logger.error('❌ Scheduled cleanup failed:', error);
    }
  }, CLEANUP_INTERVAL);

  logger.info(`⏰ Cleanup scheduled every ${CLEANUP_INTERVAL / 1000 / 60} minutes`);
};

export default {
  cleanupOldNotifications,
  scheduleCleanup,
};
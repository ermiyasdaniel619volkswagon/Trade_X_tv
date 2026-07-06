
import Report from '../../models/Report.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import { logger } from '../../utils/logger.js';
import { validateReport } from '../../validators/reportValidator.js';

export const createReport = async (req, res) => {
  try {
    const userId = req.userId;
    const reportData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const cleanedData = {
      ...reportData,
      contentProduction: {
        videosRecorded: Number(reportData.contentProduction?.videosRecorded) || 0,
        interviewsRecorded: Number(reportData.contentProduction?.interviewsRecorded) || 0,
        brollClipsCaptured: Number(reportData.contentProduction?.brollClipsCaptured) || 0,
        photosTaken: Number(reportData.contentProduction?.photosTaken) || 0,
      },
      videoEditing: {
        videosEdited: Number(reportData.videoEditing?.videosEdited) || 0,
        reelsProduced: Number(reportData.videoEditing?.reelsProduced) || 0,
        thumbnailsCreated: Number(reportData.videoEditing?.thumbnailsCreated) || 0,
        subtitlesAdded: reportData.videoEditing?.subtitlesAdded || false,
      },
      attendance: reportData.attendance || {},
      tradexSupport: reportData.tradexSupport || {},
      equipmentManagement: reportData.equipmentManagement || {},
      learningAndImprovement: reportData.learningAndImprovement || {},
      eod: {
        accomplishments: reportData.eod?.accomplishments || '',
        challenges: reportData.eod?.challenges || '',
        supportRequired: reportData.eod?.supportRequired || '',
      },
    };

    const validation = validateReport(cleanedData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let existingReport = await Report.findOne({
      userId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    let report;

    if (existingReport) {
      Object.assign(existingReport, cleanedData);
      existingReport.status = 'pending';
      existingReport.revisionCount = (existingReport.revisionCount || 0) + 1;
      await existingReport.save();
      report = existingReport;
      logger.info(`Report updated for user ${userId}`);
    } else {
      report = new Report({
        userId,
        ...cleanedData,
      });
      await report.save();
      logger.info(`New report created for user ${userId}`);
    }

    // =============================================
    // Send notification to ALL supervisors
    // =============================================
    try {
      const supervisors = await User.find({ role: 'supervisor', isActive: true }).select('_id');

      if (supervisors.length > 0) {
        const formattedDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        const notification = new Notification({
          title: '📋 New Report Submitted',
          message: `${user.firstName} ${user.lastName} (${user.employeeId}) has submitted a new report for ${formattedDate}. Please review it.`,
          type: 'feedback',
          priority: 'medium',
          sentBy: userId,
          targetAudience: 'specific',
          targetUsers: supervisors.map(s => s._id),
          isActive: true,
          deleteAfter: '7days', // Reports can be auto-deleted after 7 days
        });

        await notification.save();
        logger.info(`Notification sent to ${supervisors.length} supervisors about new report`);
      }
    } catch (notifError) {
      logger.error('Failed to send notification to supervisors:', notifError);
    }

    return res.status(existingReport ? 200 : 201).json({
      success: true,
      message: existingReport ? 'Report updated successfully' : 'Report submitted successfully',
      report,
    });
  } catch (error) {
    logger.error('Create report error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Report.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get my reports error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const report = await Report.findOne({ _id: id, userId });
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error('Get report by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// export const getTodayReport = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const report = await Report.findOne({
//       userId,
//       createdAt: { $gte: today, $lt: tomorrow },
//     });

//     return res.status(200).json({
//       success: true,
//       report: report || null,
//     });
//   } catch (error) {
//     logger.error('Get today report error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };
// ... keep your existing imports and other controller functions intact above ...

export const getTodayReport = async (req, res) => {
  try {
    // Generate timestamps for the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // TODO: Replace 'YourModel' with your actual Mongoose model (e.g., Task, Appointment, Report)
    // const todayData = await YourModel.find({
    //   createdAt: { $gte: startOfDay, $lte: endOfDay }
    // });

    return res.status(200).json({
      success: true,
      message: "Today's report data retrieved successfully.",
      data: [] // Pass your todayData variable here once the model is linked
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating today's report.",
      error: error.message
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalReports, approvedReports, pendingReports, todayReport] = await Promise.all([
      Report.countDocuments({ userId }),
      Report.countDocuments({ userId, status: 'approved' }),
      Report.countDocuments({ userId, status: 'pending' }),
      Report.findOne({
        userId,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
    ]);

    const stats = await Report.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalVideosRecorded: { $sum: '$contentProduction.videosRecorded' },
          totalInterviewsRecorded: { $sum: '$contentProduction.interviewsRecorded' },
          totalBrollClips: { $sum: '$contentProduction.brollClipsCaptured' },
          totalPhotos: { $sum: '$contentProduction.photosTaken' },
          totalVideosEdited: { $sum: '$videoEditing.videosEdited' },
          totalReelsProduced: { $sum: '$videoEditing.reelsProduced' },
          totalThumbnails: { $sum: '$videoEditing.thumbnailsCreated' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalReports,
        approvedReports,
        pendingReports,
        hasTodayReport: !!todayReport,
        todayReportId: todayReport?._id || null,
        ...(stats[0] || {}),
      },
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const report = await Report.findOne({ _id: id, userId });
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
      });
    }

    if (report.status === 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete an approved report',
      });
    }

    await report.deleteOne();

    logger.info(`Report ${id} deleted by user ${userId}`);

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    logger.error('Delete report error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// import Report from '../../models/Report.js';
// import User from '../../models/User.js';
// import Notification from '../../models/Notification.js';
// import Equipment from '../../models/Equipment.js';
// import { logger } from '../../utils/logger.js';
// import { generateEmployeeId } from '../../utils/helpers.js';
// import mongoose from 'mongoose';


// export const getDashboardStats = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const [
//       totalUsers,
//       activeUsers,
//       pendingReports,
//       todayReports,
//       totalEquipment,
//       availableEquipment,
//       totalReports,
//       approvedReports,
//     ] = await Promise.all([
//       User.countDocuments(),
//       User.countDocuments({ isActive: true }),
//       Report.countDocuments({ status: 'pending' }),
//       Report.countDocuments({ 
//         createdAt: { $gte: today, $lt: tomorrow } 
//       }),
//       Equipment.countDocuments({ isActive: true }),
//       Equipment.countDocuments({ status: 'available', isActive: true }),
//       Report.countDocuments(),
//       Report.countDocuments({ status: 'approved' }),
//     ]);

//     const recentReports = await Report.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('userId', 'firstName lastName email employeeId');

//     const approvalRate = totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0;

//     return res.status(200).json({
//       success: true,
//       stats: {
//         users: { total: totalUsers, active: activeUsers },
//         reports: {
//           total: totalReports,
//           pending: pendingReports,
//           approved: approvedReports,
//           today: todayReports,
//           approvalRate,
//         },
//         equipment: { total: totalEquipment, available: availableEquipment },
//         recentReports,
//       },
//     });
//   } catch (error) {
//     logger.error('Get dashboard stats error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const getReportDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid report ID',
//       });
//     }

//     const report = await Report.findById(id)
//       .populate('userId', 'firstName lastName email employeeId department')
//       .populate('reviewedBy', 'firstName lastName email');

//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         error: 'Report not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       report,
//     });
//   } catch (error) {
//     logger.error('Get report details error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };
 
// export const reviewReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, feedback } = req.body;
//     const supervisorId = req.userId;

//     if (!status || !['approved', 'revision_required', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid status. Must be approved, revision_required, or rejected',
//       });
//     }

//     const report = await Report.findById(id);
//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         error: 'Report not found',
//       });
//     }

//     if (report.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'Report has already been reviewed',
//       });
//     }

//     report.status = status;
//     report.supervisorFeedback = feedback || '';
//     report.reviewedBy = supervisorId;
//     report.reviewedAt = new Date();
//     await report.save();

//     // =============================================
//     // Send notification ONLY to the report submitter
//     // NOT to the supervisor who reviewed it
//     // =============================================
//     const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });

//     const notification = new Notification({
//       title: status === 'approved' ? '✅ Report Approved' : status === 'revision_required' ? '🔄 Revision Required' : '❌ Report Rejected',
//       message: `Your report for ${formattedDate} has been ${status}.${feedback ? `\n\nFeedback: ${feedback}` : ''}`,
//       type: 'feedback',
//       priority: status === 'rejected' ? 'urgent' : status === 'revision_required' ? 'high' : 'medium',
//       sentBy: supervisorId,
//       targetAudience: 'specific',
//       targetUsers: [report.userId],
//       isActive: true,
//       deleteAfter: '7days',
//     });
//     await notification.save();

//     logger.info(`Report ${id} reviewed by ${supervisorId} with status ${status}`);

//     const pendingCount = await Report.countDocuments({ status: 'pending' });

//     return res.status(200).json({
//       success: true,
//       message: 'Report reviewed successfully',
//       report,
//       pendingCount,
//     });
//   } catch (error) {
//     logger.error('Review report error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error: ' + error.message,
//     });
//   }
// };

// export const getPendingReports = async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [reports, total] = await Promise.all([
//       Report.find({ status: 'pending' })
//         .sort({ createdAt: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('userId', 'firstName lastName email employeeId department'),
//       Report.countDocuments({ status: 'pending' }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       reports,
//       pendingCount: total,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get pending reports error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const getAllReports = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, userId, startDate, endDate } = req.query;

//     const query = {};
//     if (status) query.status = status;
//     if (userId) query.userId = userId;
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = new Date(startDate);
//       if (endDate) query.date.$lte = new Date(endDate);
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [reports, total] = await Promise.all([
//       Report.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('userId', 'firstName lastName email employeeId department'),
//       Report.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       success: true,
//       reports,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get all reports error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const getAllUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 50, role, isActive, search } = req.query;

//     const query = {};
//     if (role) query.role = role;
//     if (isActive !== undefined) query.isActive = isActive === 'true';
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       success: true,
//       users,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get all users error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const createUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role, department, phoneNumber } = req.body;

//     // =============================================
//     // FIX: Validate required fields before string operations
//     // =============================================
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         error: 'Email is required',
//       });
//     }

//     if (!firstName || !lastName) {
//       return res.status(400).json({
//         success: false,
//         error: 'First name and last name are required',
//       });
//     }

//     if (!password || password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         error: 'Password must be at least 8 characters',
//       });
//     }

//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         error: 'User with this email already exists',
//       });
//     }

//     const userRole = role && ['media_officer', 'supervisor'].includes(role) ? role : 'media_officer';

//     const user = new User({
//       firstName,
//       lastName,
//       email: email.toLowerCase(),
//       password,
//       role: userRole,
//       department: department || 'production',
//       employeeId: generateEmployeeId(),
//       isActive: true,
//       phoneNumber: phoneNumber || '',
//     });

//     await user.save();

//     logger.info(`User created by supervisor: ${user.email} (${user.role})`);

//     return res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         department: user.department,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     logger.error('Create user error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const updateUserRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     if (!role || !['media_officer', 'supervisor'].includes(role)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid role. Must be media_officer or supervisor',
//       });
//     }

//     if (id === req.userId) {
//       return res.status(403).json({
//         success: false,
//         error: 'You cannot change your own role',
//       });
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     if (req.userRole !== 'supervisor') {
//       return res.status(403).json({
//         success: false,
//         error: 'Only supervisors can change roles',
//       });
//     }

//     user.role = role;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: `User role updated to ${role}`,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         department: user.department,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     logger.error('Update user role error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const toggleUserActive = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (id === req.userId) {
//       return res.status(403).json({
//         success: false,
//         error: 'You cannot deactivate your own account',
//       });
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     if (req.userRole !== 'supervisor') {
//       return res.status(403).json({
//         success: false,
//         error: 'Only supervisors can deactivate users',
//       });
//     }

//     user.isActive = !user.isActive;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         department: user.department,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     logger.error('Toggle user active error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (id === req.userId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Cannot delete your own account',
//       });
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     if (req.userRole !== 'supervisor') {
//       return res.status(403).json({
//         success: false,
//         error: 'Only supervisors can delete users',
//       });
//     }

//     await user.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: 'User deleted successfully',
//     });
//   } catch (error) {
//     logger.error('Delete user error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     delete updates.password;

//     if (updates.role && req.userRole !== 'supervisor') {
//       delete updates.role;
//     }

//     if (updates.role && !['media_officer', 'supervisor'].includes(updates.role)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid role. Must be media_officer or supervisor',
//       });
//     }

//     Object.assign(user, updates);
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: 'User updated successfully',
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         department: user.department,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     logger.error('Update user error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const getTeamMembers = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, role, isActive, search } = req.query;

//     const query = {};
//     if (role) query.role = role;
//     if (isActive !== undefined) query.isActive = isActive === 'true';
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       success: true,
//       users,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get team members error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// export const getUserStats = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).select('-password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }

//     const [reports, equipment] = await Promise.all([
//       Report.find({ userId: id }).sort({ createdAt: -1 }).limit(50),
//       Equipment.find({ assignedTo: id }),
//     ]);

//     const stats = {
//       totalReports: reports.length,
//       approvedReports: reports.filter(r => r.status === 'approved').length,
//       pendingReports: reports.filter(r => r.status === 'pending').length,
//       totalEquipment: equipment.length,
//       production: {
//         videosRecorded: reports.reduce((sum, r) => sum + (r.contentProduction?.videosRecorded || 0), 0),
//         interviewsRecorded: reports.reduce((sum, r) => sum + (r.contentProduction?.interviewsRecorded || 0), 0),
//         brollClips: reports.reduce((sum, r) => sum + (r.contentProduction?.brollClipsCaptured || 0), 0),
//         photos: reports.reduce((sum, r) => sum + (r.contentProduction?.photosTaken || 0), 0),
//         videosEdited: reports.reduce((sum, r) => sum + (r.videoEditing?.videosEdited || 0), 0),
//         reelsProduced: reports.reduce((sum, r) => sum + (r.videoEditing?.reelsProduced || 0), 0),
//         thumbnails: reports.reduce((sum, r) => sum + (r.videoEditing?.thumbnailsCreated || 0), 0),
//       },
//       recentReports: reports.slice(0, 5),
//     };

//     return res.status(200).json({
//       success: true,
//       stats,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         employeeId: user.employeeId,
//         department: user.department,
//         isActive: user.isActive,
//         lastLogin: user.lastLogin,
//       },
//     });
//   } catch (error) {
//     logger.error('Get user stats error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // ✅ REMOVED: incrementVideoViews function
// // This was causing ReferenceError: Video is not defined
// // The function is correctly implemented in videoController.js
// // =============================================

import Report from '../../models/Report.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import Equipment from '../../models/Equipment.js';
import AdvertisingRequest from '../../models/AdvertisingRequest.js'; // ✅ ADD THIS
import { logger } from '../../utils/logger.js';
import { generateEmployeeId } from '../../utils/helpers.js';
import mongoose from 'mongoose';

// =============================================
// EXISTING FUNCTIONS (KEEP ALL OF THESE)
// =============================================

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers,
      activeUsers,
      pendingReports,
      todayReports,
      totalEquipment,
      availableEquipment,
      totalReports,
      approvedReports,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      Equipment.countDocuments({ isActive: true }),
      Equipment.countDocuments({ status: 'available', isActive: true }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'approved' }),
    ]);

    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'firstName lastName email employeeId');

    const approvalRate = totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, active: activeUsers },
        reports: {
          total: totalReports,
          pending: pendingReports,
          approved: approvedReports,
          today: todayReports,
          approvalRate,
        },
        equipment: { total: totalEquipment, available: availableEquipment },
        recentReports,
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getReportDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid report ID',
      });
    }

    const report = await Report.findById(id)
      .populate('userId', 'firstName lastName email employeeId department')
      .populate('reviewedBy', 'firstName lastName email');

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
    logger.error('Get report details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
 
export const reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const supervisorId = req.userId;

    if (!status || !['approved', 'revision_required', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be approved, revision_required, or rejected',
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
      });
    }

    if (report.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Report has already been reviewed',
      });
    }

    report.status = status;
    report.supervisorFeedback = feedback || '';
    report.reviewedBy = supervisorId;
    report.reviewedAt = new Date();
    await report.save();

    const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const notification = new Notification({
      title: status === 'approved' ? '✅ Report Approved' : status === 'revision_required' ? '🔄 Revision Required' : '❌ Report Rejected',
      message: `Your report for ${formattedDate} has been ${status}.${feedback ? `\n\nFeedback: ${feedback}` : ''}`,
      type: 'feedback',
      priority: status === 'rejected' ? 'urgent' : status === 'revision_required' ? 'high' : 'medium',
      sentBy: supervisorId,
      targetAudience: 'specific',
      targetUsers: [report.userId],
      isActive: true,
      deleteAfter: '7days',
    });
    await notification.save();

    logger.info(`Report ${id} reviewed by ${supervisorId} with status ${status}`);

    const pendingCount = await Report.countDocuments({ status: 'pending' });

    return res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      report,
      pendingCount,
    });
  } catch (error) {
    logger.error('Review report error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
    });
  }
};

export const getPendingReports = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find({ status: 'pending' })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName email employeeId department'),
      Report.countDocuments({ status: 'pending' }),
    ]);

    return res.status(200).json({
      success: true,
      reports,
      pendingCount: total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get pending reports error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName email employeeId department'),
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
    logger.error('Get all reports error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, role, isActive, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, phoneNumber } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required',
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const userRole = role && ['media_officer', 'supervisor'].includes(role) ? role : 'media_officer';

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: userRole,
      department: department || 'production',
      employeeId: generateEmployeeId(),
      isActive: true,
      phoneNumber: phoneNumber || '',
    });

    await user.save();

    logger.info(`User created by supervisor: ${user.email} (${user.role})`);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['media_officer', 'supervisor'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be media_officer or supervisor',
      });
    }

    if (id === req.userId) {
      return res.status(403).json({
        success: false,
        error: 'You cannot change your own role',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (req.userRole !== 'supervisor') {
      return res.status(403).json({
        success: false,
        error: 'Only supervisors can change roles',
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(403).json({
        success: false,
        error: 'You cannot deactivate your own account',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (req.userRole !== 'supervisor') {
      return res.status(403).json({
        success: false,
        error: 'Only supervisors can deactivate users',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Toggle user active error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (req.userRole !== 'supervisor') {
      return res.status(403).json({
        success: false,
        error: 'Only supervisors can delete users',
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    delete updates.password;

    if (updates.role && req.userRole !== 'supervisor') {
      delete updates.role;
    }

    if (updates.role && !['media_officer', 'supervisor'].includes(updates.role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be media_officer or supervisor',
      });
    }

    Object.assign(user, updates);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get team members error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const [reports, equipment] = await Promise.all([
      Report.find({ userId: id }).sort({ createdAt: -1 }).limit(50),
      Equipment.find({ assignedTo: id }),
    ]);

    const stats = {
      totalReports: reports.length,
      approvedReports: reports.filter(r => r.status === 'approved').length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      totalEquipment: equipment.length,
      production: {
        videosRecorded: reports.reduce((sum, r) => sum + (r.contentProduction?.videosRecorded || 0), 0),
        interviewsRecorded: reports.reduce((sum, r) => sum + (r.contentProduction?.interviewsRecorded || 0), 0),
        brollClips: reports.reduce((sum, r) => sum + (r.contentProduction?.brollClipsCaptured || 0), 0),
        photos: reports.reduce((sum, r) => sum + (r.contentProduction?.photosTaken || 0), 0),
        videosEdited: reports.reduce((sum, r) => sum + (r.videoEditing?.videosEdited || 0), 0),
        reelsProduced: reports.reduce((sum, r) => sum + (r.videoEditing?.reelsProduced || 0), 0),
        thumbnails: reports.reduce((sum, r) => sum + (r.videoEditing?.thumbnailsCreated || 0), 0),
      },
      recentReports: reports.slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      stats,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ NEW: ADVERTISING REQUESTS FUNCTIONS (ADD THESE)
// =============================================

// 1. GET ALL REQUESTS
export const getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { companyIndustry: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      AdvertisingRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('customerId', 'firstName lastName email phone')
        .populate('reviewedBy', 'firstName lastName email'),
      AdvertisingRequest.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get all requests error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// 2. GET REQUEST DETAILS
export const getRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findById(id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('reviewedBy', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    logger.error('Get request details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// 3. REVIEW REQUEST (Approve/Reject/Revision)
export const reviewRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;
    const { action, notes, finalPrice } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot review request with status: ${request.status}`,
      });
    }

    let notificationMessage = '';
    let notificationTitle = '';

    switch (action) {
      case 'approve':
        request.status = 'approved';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        if (notes) request.supervisorNotes = notes;
        if (finalPrice) request.finalPrice = finalPrice;
        notificationTitle = '✅ Advertising Request Approved';
        notificationMessage = `Your advertising request for "${request.companyName}" has been approved. ${finalPrice ? `Final price: ${finalPrice.toLocaleString()} ETB` : ''}`;
        break;

      case 'reject':
        request.status = 'rejected';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.supervisorNotes = notes || 'No reason provided';
        notificationTitle = '❌ Advertising Request Rejected';
        notificationMessage = `Your advertising request for "${request.companyName}" has been rejected. Reason: ${request.supervisorNotes}`;
        break;

      case 'revision':
        request.status = 'revision_required';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.supervisorNotes = notes || 'Please revise your request';
        notificationTitle = '🔄 Revision Required';
        notificationMessage = `Your advertising request for "${request.companyName}" needs revision. Notes: ${request.supervisorNotes}`;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Must be approve, reject, or revision',
        });
    }

    await request.save();

    // Send notification to customer
    try {
      const customer = await User.findById(request.customerId);
      if (customer) {
        const notification = new Notification({
          title: notificationTitle,
          message: notificationMessage,
          type: 'feedback',
          priority: action === 'reject' ? 'urgent' : 'medium',
          sentBy: adminId,
          targetAudience: 'specific',
          targetUsers: [request.customerId],
          isActive: true,
          deleteAfter: '30days',
        });
        await notification.save();
        logger.info(`Notification sent to customer ${request.customerId}`);
      }
    } catch (notifError) {
      logger.error('Failed to send notification:', notifError);
    }

    logger.info(`Request ${id} ${action} by admin ${adminId}`);

    return res.status(200).json({
      success: true,
      message: `Request ${action}d successfully`,
      request,
    });
  } catch (error) {
    logger.error('Review request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// 4. UPDATE PRODUCTION STATUS
export const updateProductionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    if (status === 'in_production' && request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Only approved requests can go to production',
      });
    }

    if (status === 'completed' && request.status !== 'in_production') {
      return res.status(400).json({
        success: false,
        error: 'Only production requests can be completed',
      });
    }

    request.status = status;
    if (notes) request.supervisorNotes = notes;

    await request.save();

    // Send notification to customer
    try {
      const customer = await User.findById(request.customerId);
      if (customer) {
        const notification = new Notification({
          title: `📊 Production ${status === 'in_production' ? 'Started' : 'Completed'}`,
          message: `Your advertising request for "${request.companyName}" is now ${status === 'in_production' ? 'in production' : 'completed'}.`,
          type: 'feedback',
          priority: 'medium',
          sentBy: req.userId,
          targetAudience: 'specific',
          targetUsers: [request.customerId],
          isActive: true,
          deleteAfter: '30days',
        });
        await notification.save();
      }
    } catch (notifError) {
      logger.error('Failed to send notification:', notifError);
    }

    logger.info(`Production status updated for request ${id} to ${status}`);

    return res.status(200).json({
      success: true,
      message: `Production status updated to ${status}`,
      request,
    });
  } catch (error) {
    logger.error('Update production status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// 5. GET REQUEST STATISTICS
export const getRequestStats = async (req, res) => {
  try {
    const [total, pending, approved, revision_required, rejected, in_production, completed] = await Promise.all([
      AdvertisingRequest.countDocuments(),
      AdvertisingRequest.countDocuments({ status: 'pending' }),
      AdvertisingRequest.countDocuments({ status: 'approved' }),
      AdvertisingRequest.countDocuments({ status: 'revision_required' }),
      AdvertisingRequest.countDocuments({ status: 'rejected' }),
      AdvertisingRequest.countDocuments({ status: 'in_production' }),
      AdvertisingRequest.countDocuments({ status: 'completed' }),
    ]);

    const recent = await AdvertisingRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        revision_required,
        rejected,
        in_production,
        completed,
      },
      recent,
    });
  } catch (error) {
    logger.error('Get request stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
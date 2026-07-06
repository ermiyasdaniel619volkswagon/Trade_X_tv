
import AdvertisingRequest from '../../models/AdvertisingRequest.js';
import Customer from '../../models/Customer.js';
import Notification from '../../models/Notification.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

// =============================================
// GET ALL REQUESTS (Supervisor Only)
// =============================================

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
        .populate('customerId', 'email')
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
      .populate('customerId', 'email')
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

// =============================================
// REVIEW REQUEST (Supervisor Only)
// =============================================

export const reviewRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const supervisorId = req.userId;
    const { action, notes, finalPrice, productionStartDate } = req.body;

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

    if (request.status !== 'pending' && request.status !== 'reviewing') {
      return res.status(400).json({
        success: false,
        error: 'Request is not pending review',
      });
    }

    let notificationMessage = '';
    let notificationTitle = '';

    switch (action) {
      case 'approve':
        request.status = 'approved';
        request.reviewedBy = supervisorId;
        request.reviewedAt = new Date();
        if (notes) request.supervisorNotes = notes;
        if (finalPrice) request.finalPrice = finalPrice;
        if (productionStartDate) request.productionStartDate = new Date(productionStartDate);
        notificationTitle = '✅ Advertising Request Approved';
        notificationMessage = `Your advertising request for "${request.companyName}" has been approved. ${finalPrice ? `Final price: $${finalPrice}` : ''}`;
        break;

      case 'reject':
        request.status = 'rejected';
        request.reviewedBy = supervisorId;
        request.reviewedAt = new Date();
        request.rejectionReason = notes || 'No reason provided';
        notificationTitle = '❌ Advertising Request Rejected';
        notificationMessage = `Your advertising request for "${request.companyName}" has been rejected. Reason: ${request.rejectionReason}`;
        break;

      case 'reviewing':
        request.status = 'reviewing';
        request.reviewedBy = supervisorId;
        request.reviewedAt = new Date();
        if (notes) request.supervisorNotes = notes;
        notificationTitle = '📋 Request Under Review';
        notificationMessage = `Your advertising request for "${request.companyName}" is being reviewed.`;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Must be approve, reject, or reviewing',
        });
    }

    await request.save();

    // Send notification to customer
    try {
      const customer = await Customer.findById(request.customerId);
      if (customer) {
        const notification = new Notification({
          title: notificationTitle,
          message: notificationMessage,
          type: 'feedback',
          priority: action === 'reject' ? 'urgent' : 'medium',
          sentBy: supervisorId,
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

    logger.info(`Request ${id} ${action} by supervisor ${supervisorId}`);

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

// =============================================
// ✅ ADD/UPDATE PRODUCTION STATUS (Supervisor Only)
// =============================================

export const updateProductionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, productionStartDate, productionEndDate, assignedTeam } = req.body;

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

    // Validate status transition
    const validStatuses = ['production', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (status === 'production' && request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Only approved requests can go to production',
      });
    }

    if (status === 'completed' && request.status !== 'production') {
      return res.status(400).json({
        success: false,
        error: 'Only production requests can be completed',
      });
    }

    // Update the request
    request.status = status;
    if (notes) request.supervisorNotes = notes;
    if (productionStartDate) request.productionStartDate = new Date(productionStartDate);
    if (productionEndDate) request.productionEndDate = new Date(productionEndDate);
    if (assignedTeam) request.assignedTeam = assignedTeam;

    await request.save();

    // Send notification to customer
    try {
      const customer = await Customer.findById(request.customerId);
      if (customer) {
        const notification = new Notification({
          title: `📊 Production ${status === 'production' ? 'Started' : status === 'completed' ? 'Completed' : 'Updated'}`,
          message: `Your advertising request for "${request.companyName}" is now ${status}.`,
          type: 'feedback',
          priority: 'medium',
          sentBy: req.userId,
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

// =============================================
// GET STATISTICS (Supervisor Only)
// =============================================

export const getRequestStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, production, completed] = await Promise.all([
      AdvertisingRequest.countDocuments(),
      AdvertisingRequest.countDocuments({ status: 'pending' }),
      AdvertisingRequest.countDocuments({ status: 'approved' }),
      AdvertisingRequest.countDocuments({ status: 'rejected' }),
      AdvertisingRequest.countDocuments({ status: 'production' }),
      AdvertisingRequest.countDocuments({ status: 'completed' }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        production,
        completed,
      },
    });
  } catch (error) {
    logger.error('Get request stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
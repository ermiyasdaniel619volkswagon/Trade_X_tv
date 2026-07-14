
import AdvertisingRequest from '../../models/AdvertisingRequest.js';
import Customer from '../../models/Customer.js';
import { validateAdvertisingRequest } from '../../validators/customerValidator.js';
import { logger } from '../../utils/logger.js';

// =============================================
// ADVERTISING REQUESTS
// =============================================

export const createRequest = async (req, res) => {
  try {
    const customerId = req.userId;
    const requestData = req.body;

    const { isValid, errors } = validateAdvertisingRequest(requestData);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const requiredFields = ['companyName', 'companyIndustry', 'adType', 'contactPerson'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return res.status(400).json({
          success: false,
          error: `Required property '${field}' is missing.`,
        });
      }
    }

    const sanitizedPayload = {
      ...requestData,
      customerId,
      status: 'pending',
      reviewedBy: undefined,
      reviewedAt: undefined,
      supervisorNotes: undefined,
      finalPrice: undefined,
    };

    const newRequest = new AdvertisingRequest(sanitizedPayload);
    await newRequest.save();

    logger.info(`✨ Ad Request created for customer ${customerId}. ID: ${newRequest._id}`);

    return res.status(201).json({
      success: true,
      message: 'Your advertising request has been submitted successfully.',
      request: newRequest,
    });
  } catch (error) {
    logger.error('❌ Error inside createRequest:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred.',
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const customerId = req.userId;
    const requests = await AdvertisingRequest.find({ customerId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    logger.error('❌ Error inside getMyRequests:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch records.',
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;

    const request = await AdvertisingRequest.findOne({ _id: id, customerId });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    logger.error('❌ Error inside getRequestById:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch record.',
    });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;
    const updates = req.body;

    const request = await AdvertisingRequest.findOne({ _id: id, customerId });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Record not found.',
      });
    }

    if (request.status !== 'pending' && request.status !== 'revision_required') {
      return res.status(400).json({
        success: false,
        error: `Cannot modify request with status: ${request.status}.`,
      });
    }

    delete updates.status;
    delete updates.customerId;
    delete updates.reviewedBy;
    delete updates.reviewedAt;
    delete updates.finalPrice;
    delete updates.supervisorNotes;

    const simulatedData = { ...request.toObject(), ...updates };
    const { isValid, errors } = validateAdvertisingRequest(simulatedData);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    Object.assign(request, updates);
    
    if (request.status === 'revision_required') {
      request.status = 'pending';
    }

    await request.save();
    logger.info(`📝 Customer ${customerId} updated request ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Record updated successfully.',
      request,
    });
  } catch (error) {
    logger.error('❌ Error inside updateRequest:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update record.',
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;

    const request = await AdvertisingRequest.findOne({ _id: id, customerId });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Record not found.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending submissions can be cancelled.',
      });
    }

    await AdvertisingRequest.deleteOne({ _id: id });
    logger.info(`🗑️ Customer ${customerId} deleted request ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Request cancelled successfully.',
    });
  } catch (error) {
    logger.error('❌ Error inside deleteRequest:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete record.',
    });
  }
};

export const submitRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;

    const request = await AdvertisingRequest.findOne({ _id: id, customerId });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (request.status !== 'pending' && request.status !== 'revision_required') {
      return res.status(400).json({
        success: false,
        error: `Cannot submit request with status: ${request.status}`,
      });
    }

    if (request.status === 'revision_required') {
      request.status = 'pending';
    }

    await request.save();
    logger.info(`📤 Customer ${customerId} submitted request ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Request submitted for review.',
      request,
    });
  } catch (error) {
    logger.error('❌ Error inside submitRequest:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit request.',
    });
  }
};

// =============================================
// ✅ CUSTOMER PROFILE MANAGEMENT
// =============================================

export const getProfile = async (req, res) => {
  try {
    const customerId = req.userId;
    const customer = await Customer.findById(customerId).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found.',
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    logger.error('❌ Error inside getProfile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile.',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const customerId = req.userId;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.isActive;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;
    delete updates.email;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found.',
      });
    }

    logger.info(`👤 Customer ${customerId} updated profile`);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      customer,
    });
  } catch (error) {
    logger.error('❌ Error inside updateProfile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile.',
    });
  }
};
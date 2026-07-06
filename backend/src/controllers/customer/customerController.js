

import AdvertisingRequest from '../../models/AdvertisingRequest.js';
import AgreementTemplate from '../../models/AgreementTemplate.js';
import Customer from '../../models/Customer.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

// =============================================
// ADVERTISING REQUEST CRUD
// =============================================

export const createRequest = async (req, res) => {
  try {
    const customerId = req.userId;
    const requestData = req.body;

    const requiredFields = ['companyName', 'companyIndustry', 'adType', 'duration', 'contactPerson'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`,
        });
      }
    }

    const request = new AdvertisingRequest({
      customerId,
      ...requestData,
      status: 'draft',
      agreementAccepted: false,
    });

    await request.save();

    logger.info(`New advertising request created by customer ${customerId}`);

    return res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request,
    });
  } catch (error) {
    logger.error('Create request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const customerId = req.userId;
    const { page = 1, limit = 20, status } = req.query;

    const query = { customerId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      AdvertisingRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
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
    logger.error('Get my requests error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findOne({
      _id: id,
      customerId,
    });

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
    logger.error('Get request by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findOne({
      _id: id,
      customerId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    if (request.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft requests can be updated',
      });
    }

    delete updates.status;
    delete updates.customerId;
    delete updates.reviewedBy;
    delete updates.reviewedAt;

    Object.assign(request, updates);
    await request.save();

    logger.info(`Request ${id} updated by customer ${customerId}`);

    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      request,
    });
  } catch (error) {
    logger.error('Update request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findOne({
      _id: id,
      customerId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    if (request.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft requests can be deleted',
      });
    }

    await request.deleteOne();

    logger.info(`Request ${id} deleted by customer ${customerId}`);

    return res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    logger.error('Delete request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ FIXED: submitRequest - Creates default agreement if none exists
// =============================================
export const submitRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.userId;
    const { agreementAccepted, signature } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID',
      });
    }

    const request = await AdvertisingRequest.findOne({
      _id: id,
      customerId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    if (request.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft requests can be submitted',
      });
    }

    if (!agreementAccepted) {
      return res.status(400).json({
        success: false,
        error: 'You must accept the agreement before submitting',
      });
    }

    // ✅ Get agreement or create default if none exists
    let agreement = await AgreementTemplate.getDefault();

    if (!agreement) {
      const defaultAgreement = new AgreementTemplate({
        name: "Standard Advertising Agreement",
        version: "1.0",
        content: `
          <h3>Advertising Service Agreement</h3>
          <p>This agreement is between TradeExTV and the advertising client.</p>
          <h4>Terms and Conditions:</h4>
          <ul>
            <li>The client agrees to pay the agreed upon fee for advertising services.</li>
            <li>TradeExTV will produce and air the advertisement according to the specified schedule.</li>
            <li>The client retains all rights to their brand and content.</li>
            <li>TradeExTV retains the right to refuse any content that violates our policies.</li>
            <li>This agreement is binding for the specified duration.</li>
            <li>Payment must be made within 30 days of invoice.</li>
            <li>Either party may terminate with 30 days written notice.</li>
          </ul>
          <p>By accepting this agreement, you confirm that you have read and understood all terms.</p>
        `,
        isDefault: true,
        isActive: true,
        createdBy: req.userId,
      });
      
      await defaultAgreement.save();
      agreement = defaultAgreement;
      logger.info('Default agreement created for customer submission');
    }

    request.agreementAccepted = true;
    request.agreementVersion = agreement.version;
    request.digitalSignature = {
      signedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
    };
    request.status = 'pending';

    await request.save();

    logger.info(`Request ${id} submitted by customer ${customerId}`);

    return res.status(200).json({
      success: true,
      message: 'Request submitted for review successfully',
      request,
    });
  } catch (error) {
    logger.error('Submit request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// CUSTOMER PROFILE
// =============================================

export const getProfile = async (req, res) => {
  try {
    const customerId = req.userId;

    const customer = await Customer.findById(customerId).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      profile: customer,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const customerId = req.userId;
    const updates = req.body;

    delete updates.password;
    delete updates._id;
    delete updates.isActive;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    logger.info(`Profile updated for customer ${customerId}`);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: customer,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// ✅ FIXED: getLatestAgreement - Creates default if none exists
// =============================================

export const getLatestAgreement = async (req, res) => {
  try {
    let agreement = await AgreementTemplate.getDefault();

    if (!agreement) {
      const defaultAgreement = new AgreementTemplate({
        name: "Standard Advertising Agreement",
        version: "1.0",
        content: `
          <h3>Advertising Service Agreement</h3>
          <p>This agreement is between TradeExTV and the advertising client.</p>
          <h4>Terms and Conditions:</h4>
          <ul>
            <li>The client agrees to pay the agreed upon fee for advertising services.</li>
            <li>TradeExTV will produce and air the advertisement according to the specified schedule.</li>
            <li>The client retains all rights to their brand and content.</li>
            <li>TradeExTV retains the right to refuse any content that violates our policies.</li>
            <li>This agreement is binding for the specified duration.</li>
            <li>Payment must be made within 30 days of invoice.</li>
            <li>Either party may terminate with 30 days written notice.</li>
          </ul>
          <p>By accepting this agreement, you confirm that you have read and understood all terms.</p>
        `,
        isDefault: true,
        isActive: true,
        createdBy: req.userId,
      });
      
      await defaultAgreement.save();
      agreement = defaultAgreement;
      logger.info('Default agreement created for customer');
    }

    return res.status(200).json({
      success: true,
      agreement,
    });
  } catch (error) {
    logger.error('Get latest agreement error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
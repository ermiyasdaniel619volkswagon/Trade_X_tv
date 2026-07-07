

// // // import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// // // import AgreementTemplate from '../../models/AgreementTemplate.js';
// // // import Customer from '../../models/Customer.js';
// // // import { logger } from '../../utils/logger.js';
// // // import mongoose from 'mongoose';

// // // // =============================================
// // // // ADVERTISING REQUEST CRUD
// // // // =============================================

// // // export const createRequest = async (req, res) => {
// // //   try {
// // //     const customerId = req.userId;
// // //     const requestData = req.body;

// // //     const requiredFields = ['companyName', 'companyIndustry', 'adType', 'duration', 'contactPerson'];
// // //     for (const field of requiredFields) {
// // //       if (!requestData[field]) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           error: `${field} is required`,
// // //         });
// // //       }
// // //     }

// // //     const request = new AdvertisingRequest({
// // //       customerId,
// // //       ...requestData,
// // //       status: 'draft',
// // //       agreementAccepted: false,
// // //     });

// // //     await request.save();

// // //     logger.info(`New advertising request created by customer ${customerId}`);

// // //     return res.status(201).json({
// // //       success: true,
// // //       message: 'Request created successfully',
// // //       request,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Create request error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // export const getMyRequests = async (req, res) => {
// // //   try {
// // //     const customerId = req.userId;
// // //     const { page = 1, limit = 20, status } = req.query;

// // //     const query = { customerId };
// // //     if (status) query.status = status;

// // //     const skip = (parseInt(page) - 1) * parseInt(limit);

// // //     const [requests, total] = await Promise.all([
// // //       AdvertisingRequest.find(query)
// // //         .sort({ createdAt: -1 })
// // //         .skip(skip)
// // //         .limit(parseInt(limit)),
// // //       AdvertisingRequest.countDocuments(query),
// // //     ]);

// // //     return res.status(200).json({
// // //       success: true,
// // //       requests,
// // //       pagination: {
// // //         page: parseInt(page),
// // //         limit: parseInt(limit),
// // //         total,
// // //         pages: Math.ceil(total / parseInt(limit)),
// // //       },
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get my requests error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // export const getRequestById = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const customerId = req.userId;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid request ID',
// // //       });
// // //     }

// // //     const request = await AdvertisingRequest.findOne({
// // //       _id: id,
// // //       customerId,
// // //     });

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Request not found',
// // //       });
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       request,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get request by ID error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // export const updateRequest = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const customerId = req.userId;
// // //     const updates = req.body;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid request ID',
// // //       });
// // //     }

// // //     const request = await AdvertisingRequest.findOne({
// // //       _id: id,
// // //       customerId,
// // //     });

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Request not found',
// // //       });
// // //     }

// // //     if (request.status !== 'draft') {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Only draft requests can be updated',
// // //       });
// // //     }

// // //     delete updates.status;
// // //     delete updates.customerId;
// // //     delete updates.reviewedBy;
// // //     delete updates.reviewedAt;

// // //     Object.assign(request, updates);
// // //     await request.save();

// // //     logger.info(`Request ${id} updated by customer ${customerId}`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Request updated successfully',
// // //       request,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Update request error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // export const deleteRequest = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const customerId = req.userId;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid request ID',
// // //       });
// // //     }

// // //     const request = await AdvertisingRequest.findOne({
// // //       _id: id,
// // //       customerId,
// // //     });

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Request not found',
// // //       });
// // //     }

// // //     if (request.status !== 'draft') {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Only draft requests can be deleted',
// // //       });
// // //     }

// // //     await request.deleteOne();

// // //     logger.info(`Request ${id} deleted by customer ${customerId}`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Request deleted successfully',
// // //     });
// // //   } catch (error) {
// // //     logger.error('Delete request error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // ✅ FIXED: submitRequest - Creates default agreement if none exists
// // // // =============================================
// // // export const submitRequest = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const customerId = req.userId;
// // //     const { agreementAccepted, signature } = req.body;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid request ID',
// // //       });
// // //     }

// // //     const request = await AdvertisingRequest.findOne({
// // //       _id: id,
// // //       customerId,
// // //     });

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Request not found',
// // //       });
// // //     }

// // //     if (request.status !== 'draft') {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Only draft requests can be submitted',
// // //       });
// // //     }

// // //     if (!agreementAccepted) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'You must accept the agreement before submitting',
// // //       });
// // //     }

// // //     // ✅ Get agreement or create default if none exists
// // //     let agreement = await AgreementTemplate.getDefault();

// // //     if (!agreement) {
// // //       const defaultAgreement = new AgreementTemplate({
// // //         name: "Standard Advertising Agreement",
// // //         version: "1.0",
// // //         content: `
// // //           <h3>Advertising Service Agreement</h3>
// // //           <p>This agreement is between TradeExTV and the advertising client.</p>
// // //           <h4>Terms and Conditions:</h4>
// // //           <ul>
// // //             <li>The client agrees to pay the agreed upon fee for advertising services.</li>
// // //             <li>TradeExTV will produce and air the advertisement according to the specified schedule.</li>
// // //             <li>The client retains all rights to their brand and content.</li>
// // //             <li>TradeExTV retains the right to refuse any content that violates our policies.</li>
// // //             <li>This agreement is binding for the specified duration.</li>
// // //             <li>Payment must be made within 30 days of invoice.</li>
// // //             <li>Either party may terminate with 30 days written notice.</li>
// // //           </ul>
// // //           <p>By accepting this agreement, you confirm that you have read and understood all terms.</p>
// // //         `,
// // //         isDefault: true,
// // //         isActive: true,
// // //         createdBy: req.userId,
// // //       });
      
// // //       await defaultAgreement.save();
// // //       agreement = defaultAgreement;
// // //       logger.info('Default agreement created for customer submission');
// // //     }

// // //     request.agreementAccepted = true;
// // //     request.agreementVersion = agreement.version;
// // //     request.digitalSignature = {
// // //       signedAt: new Date(),
// // //       ipAddress: req.ip || req.connection.remoteAddress,
// // //       userAgent: req.headers['user-agent'] || '',
// // //     };
// // //     request.status = 'pending';

// // //     await request.save();

// // //     logger.info(`Request ${id} submitted by customer ${customerId}`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Request submitted for review successfully',
// // //       request,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Submit request error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // CUSTOMER PROFILE
// // // // =============================================

// // // export const getProfile = async (req, res) => {
// // //   try {
// // //     const customerId = req.userId;

// // //     const customer = await Customer.findById(customerId).select('-password');
// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       profile: customer,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get profile error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // export const updateProfile = async (req, res) => {
// // //   try {
// // //     const customerId = req.userId;
// // //     const updates = req.body;

// // //     delete updates.password;
// // //     delete updates._id;
// // //     delete updates.isActive;

// // //     const customer = await Customer.findByIdAndUpdate(
// // //       customerId,
// // //       updates,
// // //       { new: true, runValidators: true }
// // //     ).select('-password');

// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     logger.info(`Profile updated for customer ${customerId}`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Profile updated successfully',
// // //       profile: customer,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Update profile error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // ✅ FIXED: getLatestAgreement - Creates default if none exists
// // // // =============================================

// // // export const getLatestAgreement = async (req, res) => {
// // //   try {
// // //     let agreement = await AgreementTemplate.getDefault();

// // //     if (!agreement) {
// // //       const defaultAgreement = new AgreementTemplate({
// // //         name: "Standard Advertising Agreement",
// // //         version: "1.0",
// // //         content: `
// // //           <h3>Advertising Service Agreement</h3>
// // //           <p>This agreement is between TradeExTV and the advertising client.</p>
// // //           <h4>Terms and Conditions:</h4>
// // //           <ul>
// // //             <li>The client agrees to pay the agreed upon fee for advertising services.</li>
// // //             <li>TradeExTV will produce and air the advertisement according to the specified schedule.</li>
// // //             <li>The client retains all rights to their brand and content.</li>
// // //             <li>TradeExTV retains the right to refuse any content that violates our policies.</li>
// // //             <li>This agreement is binding for the specified duration.</li>
// // //             <li>Payment must be made within 30 days of invoice.</li>
// // //             <li>Either party may terminate with 30 days written notice.</li>
// // //           </ul>
// // //           <p>By accepting this agreement, you confirm that you have read and understood all terms.</p>
// // //         `,
// // //         isDefault: true,
// // //         isActive: true,
// // //         createdBy: req.userId,
// // //       });
      
// // //       await defaultAgreement.save();
// // //       agreement = defaultAgreement;
// // //       logger.info('Default agreement created for customer');
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       agreement,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get latest agreement error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// // import { validateAdvertisingRequest } from '../../validators/customerValidator.js';
// // import { logger } from '../../utils/logger.js';

// // // Create a new Advertising Request from Media Kit Selection
// // export const createRequest = async (req, res) => {
// //   try {
// //     const customerId = req.userId;
// //     const requestData = req.body;

// //     // Execute Validator
// //     const { isValid, errors } = validateAdvertisingRequest(requestData);
// //     if (!isValid) {
// //       return res.status(400).json({ success: false, errors });
// //     }

// //     // Secondary sanity check for essential fields
// //     const requiredFields = ['companyName', 'companyIndustry', 'adType', 'contactPerson'];
// //     for (const field of requiredFields) {
// //       if (!requestData[field]) {
// //         return res.status(400).json({
// //           success: false,
// //           error: `Required property '${field}' is missing.`,
// //         });
// //       }
// //     }

// //     // Format clean request and isolate from manual status upgrades
// //     const sanitizedPayload = {
// //       ...requestData,
// //       customerId,
// //       status: 'pending',
// //       reviewedBy: undefined,
// //       reviewedAt: undefined,
// //       supervisorNotes: undefined,
// //       finalPrice: undefined,
// //     };

// //     const newRequest = new AdvertisingRequest(sanitizedPayload);
// //     await newRequest.save();

// //     logger.info(`✨ Ad Request created successfully for user ${customerId}. ID: ${newRequest._id}`);

// //     return res.status(201).json({
// //       success: true,
// //       message: 'Your advertising request has been submitted to TRADEX TV supervisors successfully.',
// //       request: newRequest,
// //     });
// //   } catch (error) {
// //     logger.error('❌ Error inside createRequest execution block:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'An internal error occurred while processing the transaction.',
// //     });
// //   }
// // };

// // // Get all advertising submissions owned by the logged-in customer
// // export const getMyRequests = async (req, res) => {
// //   try {
// //     const customerId = req.userId;
// //     const requests = await AdvertisingRequest.find({ customerId }).sort({ createdAt: -1 });

// //     return res.status(200).json({
// //       success: true,
// //       count: requests.length,
// //       requests,
// //     });
// //   } catch (error) {
// //     logger.error('❌ Error inside getMyRequests route handler:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Failed to safely fetch client records.',
// //     });
// //   }
// // };

// // // Read specific request item by ID with protection checks
// // export const getRequestById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const customerId = req.userId;

// //     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
// //     if (!request) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Record not found, or access privileges are missing.',
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       request,
// //     });
// //   } catch (error) {
// //     logger.error('❌ Error inside getRequestById routine:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Failed to extract database record content.',
// //     });
// //   }
// // };

// // // Update an unreviewed request safely
// // export const updateRequest = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const customerId = req.userId;
// //     const updates = req.body;

// //     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
// //     if (!request) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Target record could not be found or verified.',
// //       });
// //     }

// //     // Limit modifications to early phase requests only
// //     if (request.status !== 'pending' && request.status !== 'revision_required') {
// //       return res.status(400).json({
// //         success: false,
// //         error: `Modifying records is prohibited once marked as ${request.status}.`,
// //       });
// //     }

// //     // Sanitize inbound mutations against core administrative updates
// //     delete updates.status;
// //     delete updates.customerId;
// //     delete updates.reviewedBy;
// //     delete updates.reviewedAt;
// //     delete updates.finalPrice;
// //     delete updates.supervisorNotes;

// //     // Validate structural schema compatibility
// //     const simulatedData = { ...request.toObject(), ...updates };
// //     const { isValid, errors } = validateAdvertisingRequest(simulatedData);
// //     if (!isValid) {
// //       return res.status(400).json({ success: false, errors });
// //     }

// //     Object.assign(request, updates);
    
// //     // Automatically reset status to pending when modified by customer
// //     if (request.status === 'revision_required') {
// //       request.status = 'pending';
// //     }

// //     await request.save();
// //     logger.info(`📝 Client ${customerId} successfully updated request context for ${id}`);

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Record updated and pushed to review queue successfully.',
// //       request,
// //     });
// //   } catch (error) {
// //     logger.error('❌ Error inside updateRequest engine context:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal service breakdown prevented modification saving.',
// //     });
// //   }
// // };

// // // Delete/Cancel a submission before reviews occur
// // export const deleteRequest = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const customerId = req.userId;

// //     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
// //     if (!request) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Target item could not be targeted or verified.',
// //       });
// //     }

// //     if (request.status !== 'pending') {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Only unreviewed pending submissions can be explicitly cancelled.',
// //       });
// //     }

// //     await AdvertisingRequest.deleteOne({ _id: id });
// //     logger.info(`🗑️ Customer ${customerId} deleted pending item reference ${id}`);

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Advertising selection successfully cancelled and purged.',
// //     });
// //   } catch (error) {
// //     logger.error('❌ Error inside deleteRequest handling layer:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Failed to erase records cleanly from data tier.',
// //     });
// //   }
// // // };


// import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// import User from '../../models/User.js';
// import { validateAdvertisingRequest, validateProfileUpdate } from '../../validators/customerValidator.js';
// import { logger } from '../../utils/logger.js';

// // =============================================
// // ADVERTISING REQUESTS
// // =============================================

// // Create a new Advertising Request from Media Kit Selection
// export const createRequest = async (req, res) => {
//   try {
//     const customerId = req.userId;
//     const requestData = req.body;

//     // Execute Validator
//     const { isValid, errors } = validateAdvertisingRequest(requestData);
//     if (!isValid) {
//       return res.status(400).json({ success: false, errors });
//     }

//     // Secondary sanity check for essential fields
//     const requiredFields = ['companyName', 'companyIndustry', 'adType', 'contactPerson'];
//     for (const field of requiredFields) {
//       if (!requestData[field]) {
//         return res.status(400).json({
//           success: false,
//           error: `Required property '${field}' is missing.`,
//         });
//       }
//     }

//     // Format clean request and isolate from manual status upgrades
//     const sanitizedPayload = {
//       ...requestData,
//       customerId,
//       status: 'pending',
//       reviewedBy: undefined,
//       reviewedAt: undefined,
//       supervisorNotes: undefined,
//       finalPrice: undefined,
//     };

//     const newRequest = new AdvertisingRequest(sanitizedPayload);
//     await newRequest.save();

//     logger.info(`✨ Ad Request created successfully for user ${customerId}. ID: ${newRequest._id}`);

//     return res.status(201).json({
//       success: true,
//       message: 'Your advertising request has been submitted to TRADEX TV supervisors successfully.',
//       request: newRequest,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside createRequest execution block:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'An internal error occurred while processing the transaction.',
//     });
//   }
// };

// // Get all advertising submissions owned by the logged-in customer
// export const getMyRequests = async (req, res) => {
//   try {
//     const customerId = req.userId;
//     const requests = await AdvertisingRequest.find({ customerId }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: requests.length,
//       requests,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside getMyRequests route handler:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to safely fetch client records.',
//     });
//   }
// };

// // Read specific request item by ID with protection checks
// export const getRequestById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customerId = req.userId;

//     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         error: 'Record not found, or access privileges are missing.',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       request,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside getRequestById routine:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to extract database record content.',
//     });
//   }
// };

// // Update an unreviewed request safely
// export const updateRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customerId = req.userId;
//     const updates = req.body;

//     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         error: 'Target record could not be found or verified.',
//       });
//     }

//     // Limit modifications to early phase requests only
//     if (request.status !== 'pending' && request.status !== 'revision_required') {
//       return res.status(400).json({
//         success: false,
//         error: `Modifying records is prohibited once marked as ${request.status}.`,
//       });
//     }

//     // Sanitize inbound mutations against core administrative updates
//     delete updates.status;
//     delete updates.customerId;
//     delete updates.reviewedBy;
//     delete updates.reviewedAt;
//     delete updates.finalPrice;
//     delete updates.supervisorNotes;

//     // Validate structural schema compatibility
//     const simulatedData = { ...request.toObject(), ...updates };
//     const { isValid, errors } = validateAdvertisingRequest(simulatedData);
//     if (!isValid) {
//       return res.status(400).json({ success: false, errors });
//     }

//     Object.assign(request, updates);
    
//     // Automatically reset status to pending when modified by customer
//     if (request.status === 'revision_required') {
//       request.status = 'pending';
//     }

//     await request.save();
//     logger.info(`📝 Client ${customerId} successfully updated request context for ${id}`);

//     return res.status(200).json({
//       success: true,
//       message: 'Record updated and pushed to review queue successfully.',
//       request,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside updateRequest engine context:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal service breakdown prevented modification saving.',
//     });
//   }
// };

// // Delete/Cancel a submission before reviews occur
// export const deleteRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customerId = req.userId;

//     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         error: 'Target item could not be targeted or verified.',
//       });
//     }

//     if (request.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'Only unreviewed pending submissions can be explicitly cancelled.',
//       });
//     }

//     await AdvertisingRequest.deleteOne({ _id: id });
//     logger.info(`🗑️ Customer ${customerId} deleted pending item reference ${id}`);

//     return res.status(200).json({
//       success: true,
//       message: 'Advertising selection successfully cancelled and purged.',
//     });
//   } catch (error) {
//     logger.error('❌ Error inside deleteRequest handling layer:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to erase records cleanly from data tier.',
//     });
//   }
// };

// // ✅ NEW: Submit a request for review
// export const submitRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customerId = req.userId;

//     const request = await AdvertisingRequest.findOne({ _id: id, customerId });
//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         error: 'Request not found or access denied.',
//       });
//     }

//     // Only allow submission from pending or revision_required status
//     if (request.status !== 'pending' && request.status !== 'revision_required') {
//       return res.status(400).json({
//         success: false,
//         error: `Cannot submit request with status: ${request.status}`,
//       });
//     }

//     // Update status to pending (if it was revision_required)
//     if (request.status === 'revision_required') {
//       request.status = 'pending';
//     }

//     await request.save();
//     logger.info(`📤 Customer ${customerId} submitted request ${id} for review`);

//     return res.status(200).json({
//       success: true,
//       message: 'Request submitted successfully for review.',
//       request,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside submitRequest:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to submit request for review.',
//     });
//   }
// };

// // =============================================
// // PROFILE MANAGEMENT
// // =============================================

// // ✅ NEW: Get customer profile
// export const getProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await User.findById(userId).select('-password -refreshToken');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User profile not found.',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside getProfile:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to retrieve profile information.',
//     });
//   }
// };

// // ✅ NEW: Update customer profile
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const updates = req.body;

//     // Prevent updating sensitive fields
//     delete updates.password;
//     delete updates.role;
//     delete updates.isActive;
//     delete updates.refreshToken;
//     delete updates._id;
//     delete updates.createdAt;
//     delete updates.updatedAt;

//     // Validate profile update - you need to create this validator
//     // For now, we'll do basic validation
//     const errors = [];
//     if (updates.firstName && updates.firstName.trim().length < 2) {
//       errors.push({ field: 'firstName', message: 'First name must contain at least 2 characters' });
//     }
//     if (updates.lastName && updates.lastName.trim().length < 2) {
//       errors.push({ field: 'lastName', message: 'Last name must contain at least 2 characters' });
//     }
    
//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, errors });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select('-password -refreshToken');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User profile not found.',
//       });
//     }

//     logger.info(`👤 Customer ${userId} updated their profile`);

//     return res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully.',
//       user,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside updateProfile:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to update profile information.',
//     });
//   }
// };

// // =============================================
// // AGREEMENT
// // =============================================

// // ✅ NEW: Get the latest agreement
// export const getLatestAgreement = async (req, res) => {
//   try {
//     // If you have an Agreement model, use it here
//     // For now, return a static agreement
//     const agreement = {
//       version: '1.0',
//       title: 'TRADEX TV Advertising Terms & Conditions',
//       content: `
//         By submitting this advertising request, you agree to the following terms:
//         1. All advertising content must comply with Ethiopian broadcasting regulations
//         2. TRADEX TV reserves the right to review and approve all content
//         3. Payment terms will be communicated upon approval
//         4. Cancellations must be made at least 48 hours before scheduled broadcast
//         5. TRADEX TV is not responsible for third-party content linked from ads
//         6. All content must be submitted 72 hours before broadcast
//         7. TRADEX TV may use provided content for promotional purposes
//       `,
//       lastUpdated: new Date().toISOString(),
//     };

//     return res.status(200).json({
//       success: true,
//       agreement,
//     });
//   } catch (error) {
//     logger.error('❌ Error inside getLatestAgreement:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to retrieve agreement terms.',
//     });
//   }
// };

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
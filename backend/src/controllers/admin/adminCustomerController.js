
// // // // import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// // // // import Customer from '../../models/Customer.js';
// // // // import Notification from '../../models/Notification.js';
// // // // import { logger } from '../../utils/logger.js';
// // // // import mongoose from 'mongoose';

// // // // // =============================================
// // // // // GET ALL REQUESTS (Supervisor Only)
// // // // // =============================================

// // // // export const getAllRequests = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 20, status, search } = req.query;

// // // //     const query = {};
// // // //     if (status) query.status = status;
// // // //     if (search) {
// // // //       query.$or = [
// // // //         { companyName: { $regex: search, $options: 'i' } },
// // // //         { companyIndustry: { $regex: search, $options: 'i' } },
// // // //         { contactPerson: { $regex: search, $options: 'i' } },
// // // //       ];
// // // //     }

// // // //     const skip = (parseInt(page) - 1) * parseInt(limit);

// // // //     const [requests, total] = await Promise.all([
// // // //       AdvertisingRequest.find(query)
// // // //         .sort({ createdAt: -1 })
// // // //         .skip(skip)
// // // //         .limit(parseInt(limit))
// // // //         .populate('customerId', 'email')
// // // //         .populate('reviewedBy', 'firstName lastName email'),
// // // //       AdvertisingRequest.countDocuments(query),
// // // //     ]);

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       requests,
// // // //       pagination: {
// // // //         page: parseInt(page),
// // // //         limit: parseInt(limit),
// // // //         total,
// // // //         pages: Math.ceil(total / parseInt(limit)),
// // // //       },
// // // //     });
// // // //   } catch (error) {
// // // //     logger.error('Get all requests error:', error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       error: 'Internal server error',
// // // //     });
// // // //   }
// // // // };

// // // // export const getRequestDetails = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;

// // // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Invalid request ID',
// // // //       });
// // // //     }

// // // //     const request = await AdvertisingRequest.findById(id)
// // // //       .populate('customerId', 'email')
// // // //       .populate('reviewedBy', 'firstName lastName email');

// // // //     if (!request) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         error: 'Request not found',
// // // //       });
// // // //     }

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       request,
// // // //     });
// // // //   } catch (error) {
// // // //     logger.error('Get request details error:', error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       error: 'Internal server error',
// // // //     });
// // // //   }
// // // // };

// // // // // =============================================
// // // // // REVIEW REQUEST (Supervisor Only)
// // // // // =============================================

// // // // export const reviewRequest = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const supervisorId = req.userId;
// // // //     const { action, notes, finalPrice, productionStartDate } = req.body;

// // // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Invalid request ID',
// // // //       });
// // // //     }

// // // //     const request = await AdvertisingRequest.findById(id);
// // // //     if (!request) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         error: 'Request not found',
// // // //       });
// // // //     }

// // // //     if (request.status !== 'pending' && request.status !== 'reviewing') {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Request is not pending review',
// // // //       });
// // // //     }

// // // //     let notificationMessage = '';
// // // //     let notificationTitle = '';

// // // //     switch (action) {
// // // //       case 'approve':
// // // //         request.status = 'approved';
// // // //         request.reviewedBy = supervisorId;
// // // //         request.reviewedAt = new Date();
// // // //         if (notes) request.supervisorNotes = notes;
// // // //         if (finalPrice) request.finalPrice = finalPrice;
// // // //         if (productionStartDate) request.productionStartDate = new Date(productionStartDate);
// // // //         notificationTitle = '✅ Advertising Request Approved';
// // // //         notificationMessage = `Your advertising request for "${request.companyName}" has been approved. ${finalPrice ? `Final price: $${finalPrice}` : ''}`;
// // // //         break;

// // // //       case 'reject':
// // // //         request.status = 'rejected';
// // // //         request.reviewedBy = supervisorId;
// // // //         request.reviewedAt = new Date();
// // // //         request.rejectionReason = notes || 'No reason provided';
// // // //         notificationTitle = '❌ Advertising Request Rejected';
// // // //         notificationMessage = `Your advertising request for "${request.companyName}" has been rejected. Reason: ${request.rejectionReason}`;
// // // //         break;

// // // //       case 'reviewing':
// // // //         request.status = 'reviewing';
// // // //         request.reviewedBy = supervisorId;
// // // //         request.reviewedAt = new Date();
// // // //         if (notes) request.supervisorNotes = notes;
// // // //         notificationTitle = '📋 Request Under Review';
// // // //         notificationMessage = `Your advertising request for "${request.companyName}" is being reviewed.`;
// // // //         break;

// // // //       default:
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           error: 'Invalid action. Must be approve, reject, or reviewing',
// // // //         });
// // // //     }

// // // //     await request.save();

// // // //     // Send notification to customer
// // // //     try {
// // // //       const customer = await Customer.findById(request.customerId);
// // // //       if (customer) {
// // // //         const notification = new Notification({
// // // //           title: notificationTitle,
// // // //           message: notificationMessage,
// // // //           type: 'feedback',
// // // //           priority: action === 'reject' ? 'urgent' : 'medium',
// // // //           sentBy: supervisorId,
// // // //           targetAudience: 'specific',
// // // //           targetUsers: [request.customerId],
// // // //           isActive: true,
// // // //           deleteAfter: '30days',
// // // //         });
// // // //         await notification.save();
// // // //         logger.info(`Notification sent to customer ${request.customerId}`);
// // // //       }
// // // //     } catch (notifError) {
// // // //       logger.error('Failed to send notification:', notifError);
// // // //     }

// // // //     logger.info(`Request ${id} ${action} by supervisor ${supervisorId}`);

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       message: `Request ${action}d successfully`,
// // // //       request,
// // // //     });
// // // //   } catch (error) {
// // // //     logger.error('Review request error:', error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       error: 'Internal server error',
// // // //     });
// // // //   }
// // // // };

// // // // // =============================================
// // // // // ✅ ADD/UPDATE PRODUCTION STATUS (Supervisor Only)
// // // // // =============================================

// // // // export const updateProductionStatus = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const { status, notes, productionStartDate, productionEndDate, assignedTeam } = req.body;

// // // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Invalid request ID',
// // // //       });
// // // //     }

// // // //     const request = await AdvertisingRequest.findById(id);
// // // //     if (!request) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         error: 'Request not found',
// // // //       });
// // // //     }

// // // //     // Validate status transition
// // // //     const validStatuses = ['production', 'completed', 'cancelled'];
// // // //     if (!validStatuses.includes(status)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
// // // //       });
// // // //     }

// // // //     if (status === 'production' && request.status !== 'approved') {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Only approved requests can go to production',
// // // //       });
// // // //     }

// // // //     if (status === 'completed' && request.status !== 'production') {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: 'Only production requests can be completed',
// // // //       });
// // // //     }

// // // //     // Update the request
// // // //     request.status = status;
// // // //     if (notes) request.supervisorNotes = notes;
// // // //     if (productionStartDate) request.productionStartDate = new Date(productionStartDate);
// // // //     if (productionEndDate) request.productionEndDate = new Date(productionEndDate);
// // // //     if (assignedTeam) request.assignedTeam = assignedTeam;

// // // //     await request.save();

// // // //     // Send notification to customer
// // // //     try {
// // // //       const customer = await Customer.findById(request.customerId);
// // // //       if (customer) {
// // // //         const notification = new Notification({
// // // //           title: `📊 Production ${status === 'production' ? 'Started' : status === 'completed' ? 'Completed' : 'Updated'}`,
// // // //           message: `Your advertising request for "${request.companyName}" is now ${status}.`,
// // // //           type: 'feedback',
// // // //           priority: 'medium',
// // // //           sentBy: req.userId,
// // // //           targetAudience: 'specific',
// // // //           targetUsers: [request.customerId],
// // // //           isActive: true,
// // // //           deleteAfter: '30days',
// // // //         });
// // // //         await notification.save();
// // // //         logger.info(`Notification sent to customer ${request.customerId}`);
// // // //       }
// // // //     } catch (notifError) {
// // // //       logger.error('Failed to send notification:', notifError);
// // // //     }

// // // //     logger.info(`Production status updated for request ${id} to ${status}`);

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       message: `Production status updated to ${status}`,
// // // //       request,
// // // //     });
// // // //   } catch (error) {
// // // //     logger.error('Update production status error:', error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       error: 'Internal server error',
// // // //     });
// // // //   }
// // // // };

// // // // // =============================================
// // // // // GET STATISTICS (Supervisor Only)
// // // // // =============================================

// // // // export const getRequestStats = async (req, res) => {
// // // //   try {
// // // //     const [total, pending, approved, rejected, production, completed] = await Promise.all([
// // // //       AdvertisingRequest.countDocuments(),
// // // //       AdvertisingRequest.countDocuments({ status: 'pending' }),
// // // //       AdvertisingRequest.countDocuments({ status: 'approved' }),
// // // //       AdvertisingRequest.countDocuments({ status: 'rejected' }),
// // // //       AdvertisingRequest.countDocuments({ status: 'production' }),
// // // //       AdvertisingRequest.countDocuments({ status: 'completed' }),
// // // //     ]);

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       stats: {
// // // //         total,
// // // //         pending,
// // // //         approved,
// // // //         rejected,
// // // //         production,
// // // //         completed,
// // // //       },
// // // //     });
// // // //   } catch (error) {
// // // //     logger.error('Get request stats error:', error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       error: 'Internal server error',
// // // //     });
// // // //   }
// // // // };

// // // import User from '../../models/User.js';
// // // import Customer from '../../models/Customer.js';
// // // import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// // // import Notification from '../../models/Notification.js';
// // // import { logger } from '../../utils/logger.js';
// // // import mongoose from 'mongoose';

// // // // =============================================
// // // // GET ALL CUSTOMERS (Admin Only)
// // // // =============================================

// // // export const getAllCustomers = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 20, search, isActive } = req.query;

// // //     const query = { role: 'customer' };
// // //     if (isActive !== undefined) {
// // //       query.isActive = isActive === 'true';
// // //     }
// // //     if (search) {
// // //       query.$or = [
// // //         { firstName: { $regex: search, $options: 'i' } },
// // //         { lastName: { $regex: search, $options: 'i' } },
// // //         { email: { $regex: search, $options: 'i' } },
// // //         { phone: { $regex: search, $options: 'i' } },
// // //       ];
// // //     }

// // //     const skip = (parseInt(page) - 1) * parseInt(limit);

// // //     const [customers, total] = await Promise.all([
// // //       User.find(query)
// // //         .select('-password -refreshToken')
// // //         .sort({ createdAt: -1 })
// // //         .skip(skip)
// // //         .limit(parseInt(limit)),
// // //       User.countDocuments(query),
// // //     ]);

// // //     // Get request counts for each customer
// // //     const customerIds = customers.map(c => c._id);
// // //     const requestCounts = await AdvertisingRequest.aggregate([
// // //       { $match: { customerId: { $in: customerIds } } },
// // //       { $group: { _id: '$customerId', count: { $sum: 1 } } }
// // //     ]);

// // //     const customersWithCounts = customers.map(customer => {
// // //       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
// // //       return {
// // //         ...customer.toObject(),
// // //         requestCount: count ? count.count : 0,
// // //       };
// // //     });

// // //     return res.status(200).json({
// // //       success: true,
// // //       customers: customersWithCounts,
// // //       pagination: {
// // //         page: parseInt(page),
// // //         limit: parseInt(limit),
// // //         total,
// // //         pages: Math.ceil(total / parseInt(limit)),
// // //       },
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get all customers error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // GET CUSTOMER BY ID (Admin Only)
// // // // =============================================

// // // export const getCustomerById = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     const customer = await User.findOne({ _id: id, role: 'customer' })
// // //       .select('-password -refreshToken');

// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     // Get customer's advertising requests
// // //     const requests = await AdvertisingRequest.find({ customerId: id })
// // //       .sort({ createdAt: -1 })
// // //       .limit(10);

// // //     // Get request statistics
// // //     const stats = await AdvertisingRequest.aggregate([
// // //       { $match: { customerId: new mongoose.Types.ObjectId(id) } },
// // //       { $group: { 
// // //         _id: '$status', 
// // //         count: { $sum: 1 } 
// // //       } }
// // //     ]);

// // //     const requestStats = {
// // //       total: requests.length,
// // //       pending: 0,
// // //       approved: 0,
// // //       rejected: 0,
// // //       production: 0,
// // //       completed: 0,
// // //       revision_required: 0,
// // //     };

// // //     stats.forEach(stat => {
// // //       requestStats[stat._id] = stat.count;
// // //     });

// // //     return res.status(200).json({
// // //       success: true,
// // //       customer,
// // //       requests,
// // //       requestStats,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get customer by ID error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // UPDATE CUSTOMER (Admin Only)
// // // // =============================================

// // // export const updateCustomer = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const updates = req.body;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     // Prevent updating sensitive fields
// // //     delete updates.password;
// // //     delete updates.role;
// // //     delete updates.refreshToken;
// // //     delete updates._id;
// // //     delete updates.createdAt;
// // //     delete updates.updatedAt;
// // //     delete updates.__v;

// // //     const customer = await User.findOneAndUpdate(
// // //       { _id: id, role: 'customer' },
// // //       { $set: updates },
// // //       { new: true, runValidators: true }
// // //     ).select('-password -refreshToken');

// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     logger.info(`Customer ${id} updated by admin`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Customer updated successfully',
// // //       customer,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Update customer error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // TOGGLE CUSTOMER STATUS (Admin Only)
// // // // =============================================

// // // export const toggleCustomerStatus = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     const customer = await User.findOne({ _id: id, role: 'customer' });
// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     customer.isActive = !customer.isActive;
// // //     await customer.save();

// // //     logger.info(`Customer ${id} status toggled to ${customer.isActive} by admin`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
// // //       customer: {
// // //         _id: customer._id,
// // //         isActive: customer.isActive,
// // //         email: customer.email,
// // //         firstName: customer.firstName,
// // //         lastName: customer.lastName,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     logger.error('Toggle customer status error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // DELETE CUSTOMER (Admin Only)
// // // // =============================================

// // // export const deleteCustomer = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     const customer = await User.findOne({ _id: id, role: 'customer' });
// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     // Check if customer has active requests
// // //     const activeRequests = await AdvertisingRequest.countDocuments({
// // //       customerId: id,
// // //       status: { $in: ['pending', 'approved', 'production'] }
// // //     });

// // //     if (activeRequests > 0) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: `Cannot delete customer with ${activeRequests} active requests. Archive or complete them first.`,
// // //       });
// // //     }

// // //     // Soft delete - deactivate instead of hard delete
// // //     customer.isActive = false;
// // //     customer.deletedAt = new Date();
// // //     await customer.save();

// // //     logger.info(`Customer ${id} deactivated (soft delete) by admin`);

// // //     return res.status(200).json({
// // //       success: true,
// // //       message: 'Customer deactivated successfully',
// // //     });
// // //   } catch (error) {
// // //     logger.error('Delete customer error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // GET CUSTOMER STATISTICS (Admin Only)
// // // // =============================================

// // // export const getCustomerStatistics = async (req, res) => {
// // //   try {
// // //     const [total, active, inactive, totalRequests] = await Promise.all([
// // //       User.countDocuments({ role: 'customer' }),
// // //       User.countDocuments({ role: 'customer', isActive: true }),
// // //       User.countDocuments({ role: 'customer', isActive: false }),
// // //       AdvertisingRequest.countDocuments(),
// // //     ]);

// // //     // Get customers with most requests
// // //     const topCustomers = await AdvertisingRequest.aggregate([
// // //       { $group: { _id: '$customerId', count: { $sum: 1 } } },
// // //       { $sort: { count: -1 } },
// // //       { $limit: 5 },
// // //       { $lookup: {
// // //           from: 'users',
// // //           localField: '_id',
// // //           foreignField: '_id',
// // //           as: 'customer'
// // //         }},
// // //       { $unwind: '$customer' },
// // //       { $project: {
// // //           _id: 1,
// // //           count: 1,
// // //           'customer.firstName': 1,
// // //           'customer.lastName': 1,
// // //           'customer.email': 1,
// // //         }}
// // //     ]);

// // //     // Get requests by status
// // //     const requestsByStatus = await AdvertisingRequest.aggregate([
// // //       { $group: { _id: '$status', count: { $sum: 1 } } }
// // //     ]);

// // //     const statusStats = {};
// // //     requestsByStatus.forEach(stat => {
// // //       statusStats[stat._id] = stat.count;
// // //     });

// // //     return res.status(200).json({
// // //       success: true,
// // //       statistics: {
// // //         totalCustomers: total,
// // //         activeCustomers: active,
// // //         inactiveCustomers: inactive,
// // //         totalRequests,
// // //         requestsByStatus: statusStats,
// // //         topCustomers,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     logger.error('Get customer statistics error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // GET ALL CUSTOMER REQUESTS (Admin Only)
// // // // =============================================

// // // export const getCustomerRequests = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const { status, page = 1, limit = 20 } = req.query;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     const query = { customerId: id };
// // //     if (status) query.status = status;

// // //     const skip = (parseInt(page) - 1) * parseInt(limit);

// // //     const [requests, total] = await Promise.all([
// // //       AdvertisingRequest.find(query)
// // //         .sort({ createdAt: -1 })
// // //         .skip(skip)
// // //         .limit(parseInt(limit))
// // //         .populate('reviewedBy', 'firstName lastName email'),
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
// // //     logger.error('Get customer requests error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // SEND NOTIFICATION TO CUSTOMER (Admin Only)
// // // // =============================================

// // // export const sendCustomerNotification = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const { title, message, priority = 'medium' } = req.body;

// // //     if (!mongoose.Types.ObjectId.isValid(id)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Invalid customer ID',
// // //       });
// // //     }

// // //     if (!title || !message) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: 'Title and message are required',
// // //       });
// // //     }

// // //     const customer = await User.findOne({ _id: id, role: 'customer' });
// // //     if (!customer) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Customer not found',
// // //       });
// // //     }

// // //     const notification = new Notification({
// // //       title,
// // //       message,
// // //       type: 'admin',
// // //       priority,
// // //       sentBy: req.userId,
// // //       targetAudience: 'specific',
// // //       targetUsers: [id],
// // //       isActive: true,
// // //       deleteAfter: '30days',
// // //     });

// // //     await notification.save();

// // //     logger.info(`Notification sent to customer ${id} by admin ${req.userId}`);

// // //     return res.status(201).json({
// // //       success: true,
// // //       message: 'Notification sent successfully',
// // //       notification,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Send customer notification error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // // // =============================================
// // // // EXPORT CUSTOMERS DATA (Admin Only)
// // // // =============================================

// // // export const exportCustomers = async (req, res) => {
// // //   try {
// // //     const customers = await User.find({ role: 'customer' })
// // //       .select('firstName lastName email phone isActive createdAt')
// // //       .lean();

// // //     // Get request counts for each customer
// // //     const customerIds = customers.map(c => c._id);
// // //     const requestCounts = await AdvertisingRequest.aggregate([
// // //       { $match: { customerId: { $in: customerIds } } },
// // //       { $group: { _id: '$customerId', count: { $sum: 1 } } }
// // //     ]);

// // //     const exportData = customers.map(customer => {
// // //       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
// // //       return {
// // //         ...customer,
// // //         requestCount: count ? count.count : 0,
// // //         fullName: `${customer.firstName} ${customer.lastName}`,
// // //       };
// // //     });

// // //     return res.status(200).json({
// // //       success: true,
// // //       data: exportData,
// // //       total: exportData.length,
// // //     });
// // //   } catch (error) {
// // //     logger.error('Export customers error:', error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       error: 'Internal server error',
// // //     });
// // //   }
// // // };

// // import User from '../../models/User.js';
// // import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// // import Notification from '../../models/Notification.js';
// // import { logger } from '../../utils/logger.js';
// // import mongoose from 'mongoose';

// // // =============================================
// // // CUSTOMER MANAGEMENT (For Both Customer & Admin)
// // // =============================================

// // // =============================================
// // // 1. GET ALL CUSTOMERS (Admin Only)
// // // =============================================
// // export const getAllCustomers = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 20, search, isActive } = req.query;

// //     const query = { role: 'customer' };
// //     if (isActive !== undefined) {
// //       query.isActive = isActive === 'true';
// //     }
// //     if (search) {
// //       query.$or = [
// //         { firstName: { $regex: search, $options: 'i' } },
// //         { lastName: { $regex: search, $options: 'i' } },
// //         { email: { $regex: search, $options: 'i' } },
// //         { phone: { $regex: search, $options: 'i' } },
// //       ];
// //     }

// //     const skip = (parseInt(page) - 1) * parseInt(limit);

// //     const [customers, total] = await Promise.all([
// //       User.find(query)
// //         .select('-password -refreshToken')
// //         .sort({ createdAt: -1 })
// //         .skip(skip)
// //         .limit(parseInt(limit)),
// //       User.countDocuments(query),
// //     ]);

// //     // Get request counts for each customer
// //     const customerIds = customers.map(c => c._id);
// //     const requestCounts = await AdvertisingRequest.aggregate([
// //       { $match: { customerId: { $in: customerIds } } },
// //       { $group: { _id: '$customerId', count: { $sum: 1 } } }
// //     ]);

// //     const customersWithCounts = customers.map(customer => {
// //       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
// //       return {
// //         ...customer.toObject(),
// //         requestCount: count ? count.count : 0,
// //       };
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       customers: customersWithCounts,
// //       pagination: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         total,
// //         pages: Math.ceil(total / parseInt(limit)),
// //       },
// //     });
// //   } catch (error) {
// //     logger.error('Get all customers error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 2. GET CUSTOMER BY ID (Admin Only)
// // // =============================================
// // export const getCustomerById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     const customer = await User.findOne({ _id: id, role: 'customer' })
// //       .select('-password -refreshToken');

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     // Get customer's advertising requests
// //     const requests = await AdvertisingRequest.find({ customerId: id })
// //       .sort({ createdAt: -1 })
// //       .limit(10)
// //       .populate('reviewedBy', 'firstName lastName email');

// //     // Get request statistics
// //     const stats = await AdvertisingRequest.aggregate([
// //       { $match: { customerId: new mongoose.Types.ObjectId(id) } },
// //       { $group: { 
// //         _id: '$status', 
// //         count: { $sum: 1 } 
// //       } }
// //     ]);

// //     const requestStats = {
// //       total: 0,
// //       pending: 0,
// //       approved: 0,
// //       rejected: 0,
// //       in_production: 0,
// //       completed: 0,
// //       revision_required: 0,
// //     };

// //     stats.forEach(stat => {
// //       requestStats[stat._id] = stat.count;
// //       requestStats.total += stat.count;
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       customer,
// //       requests,
// //       requestStats,
// //     });
// //   } catch (error) {
// //     logger.error('Get customer by ID error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 3. GET CUSTOMER PROFILE (Customer Only)
// // // =============================================
// // export const getCustomerProfile = async (req, res) => {
// //   try {
// //     const userId = req.userId;

// //     const customer = await User.findById(userId)
// //       .select('-password -refreshToken');

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     // Get customer's advertising requests
// //     const requests = await AdvertisingRequest.find({ customerId: userId })
// //       .sort({ createdAt: -1 })
// //       .limit(5);

// //     // Get request statistics
// //     const stats = await AdvertisingRequest.aggregate([
// //       { $match: { customerId: new mongoose.Types.ObjectId(userId) } },
// //       { $group: { 
// //         _id: '$status', 
// //         count: { $sum: 1 } 
// //       } }
// //     ]);

// //     const requestStats = {
// //       total: 0,
// //       pending: 0,
// //       approved: 0,
// //       rejected: 0,
// //       in_production: 0,
// //       completed: 0,
// //       revision_required: 0,
// //     };

// //     stats.forEach(stat => {
// //       requestStats[stat._id] = stat.count;
// //       requestStats.total += stat.count;
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       customer,
// //       requests,
// //       requestStats,
// //     });
// //   } catch (error) {
// //     logger.error('Get customer profile error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 4. UPDATE CUSTOMER (Admin Only)
// // // =============================================
// // export const updateCustomer = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updates = req.body;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     // Prevent updating sensitive fields
// //     delete updates.password;
// //     delete updates.role;
// //     delete updates.refreshToken;
// //     delete updates._id;
// //     delete updates.createdAt;
// //     delete updates.updatedAt;
// //     delete updates.__v;

// //     const customer = await User.findOneAndUpdate(
// //       { _id: id, role: 'customer' },
// //       { $set: updates },
// //       { new: true, runValidators: true }
// //     ).select('-password -refreshToken');

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     logger.info(`Customer ${id} updated by admin`);

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Customer updated successfully',
// //       customer,
// //     });
// //   } catch (error) {
// //     logger.error('Update customer error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 5. UPDATE CUSTOMER PROFILE (Customer Only)
// // // =============================================
// // export const updateCustomerProfile = async (req, res) => {
// //   try {
// //     const userId = req.userId;
// //     const updates = req.body;

// //     // Prevent updating sensitive fields
// //     delete updates.password;
// //     delete updates.role;
// //     delete updates.isActive;
// //     delete updates.refreshToken;
// //     delete updates._id;
// //     delete updates.createdAt;
// //     delete updates.updatedAt;
// //     delete updates.__v;

// //     const customer = await User.findByIdAndUpdate(
// //       userId,
// //       { $set: updates },
// //       { new: true, runValidators: true }
// //     ).select('-password -refreshToken');

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     logger.info(`Customer ${userId} updated their profile`);

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Profile updated successfully',
// //       customer,
// //     });
// //   } catch (error) {
// //     logger.error('Update customer profile error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 6. TOGGLE CUSTOMER STATUS (Admin Only)
// // // =============================================
// // export const toggleCustomerStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     const customer = await User.findOne({ _id: id, role: 'customer' });
// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     customer.isActive = !customer.isActive;
// //     await customer.save();

// //     logger.info(`Customer ${id} status toggled to ${customer.isActive} by admin`);

// //     return res.status(200).json({
// //       success: true,
// //       message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
// //       customer: {
// //         _id: customer._id,
// //         isActive: customer.isActive,
// //         email: customer.email,
// //         firstName: customer.firstName,
// //         lastName: customer.lastName,
// //       },
// //     });
// //   } catch (error) {
// //     logger.error('Toggle customer status error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 7. DELETE CUSTOMER (Admin Only - Soft Delete)
// // // =============================================
// // export const deleteCustomer = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     const customer = await User.findOne({ _id: id, role: 'customer' });
// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     // Check if customer has active requests
// //     const activeRequests = await AdvertisingRequest.countDocuments({
// //       customerId: id,
// //       status: { $in: ['pending', 'approved', 'in_production'] }
// //     });

// //     if (activeRequests > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         error: `Cannot delete customer with ${activeRequests} active requests. Complete or cancel them first.`,
// //       });
// //     }

// //     // Soft delete
// //     customer.isActive = false;
// //     customer.deletedAt = new Date();
// //     await customer.save();

// //     logger.info(`Customer ${id} deactivated (soft delete) by admin`);

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Customer deactivated successfully',
// //     });
// //   } catch (error) {
// //     logger.error('Delete customer error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 8. GET CUSTOMER STATISTICS (Admin Only)
// // // =============================================
// // export const getCustomerStatistics = async (req, res) => {
// //   try {
// //     const [total, active, inactive, totalRequests] = await Promise.all([
// //       User.countDocuments({ role: 'customer' }),
// //       User.countDocuments({ role: 'customer', isActive: true }),
// //       User.countDocuments({ role: 'customer', isActive: false }),
// //       AdvertisingRequest.countDocuments(),
// //     ]);

// //     // Get customers with most requests
// //     const topCustomers = await AdvertisingRequest.aggregate([
// //       { $group: { _id: '$customerId', count: { $sum: 1 } } },
// //       { $sort: { count: -1 } },
// //       { $limit: 5 },
// //       { $lookup: {
// //           from: 'users',
// //           localField: '_id',
// //           foreignField: '_id',
// //           as: 'customer'
// //         }},
// //       { $unwind: '$customer' },
// //       { $project: {
// //           _id: 1,
// //           count: 1,
// //           'customer.firstName': 1,
// //           'customer.lastName': 1,
// //           'customer.email': 1,
// //         }}
// //     ]);

// //     // Get requests by status
// //     const requestsByStatus = await AdvertisingRequest.aggregate([
// //       { $group: { _id: '$status', count: { $sum: 1 } } }
// //     ]);

// //     const statusStats = {};
// //     requestsByStatus.forEach(stat => {
// //       statusStats[stat._id] = stat.count;
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       statistics: {
// //         totalCustomers: total,
// //         activeCustomers: active,
// //         inactiveCustomers: inactive,
// //         totalRequests,
// //         requestsByStatus: statusStats,
// //         topCustomers,
// //       },
// //     });
// //   } catch (error) {
// //     logger.error('Get customer statistics error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 9. GET CUSTOMER REQUESTS (Admin Only)
// // // =============================================
// // export const getCustomerRequests = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status, page = 1, limit = 20 } = req.query;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     const query = { customerId: id };
// //     if (status) query.status = status;

// //     const skip = (parseInt(page) - 1) * parseInt(limit);

// //     const [requests, total] = await Promise.all([
// //       AdvertisingRequest.find(query)
// //         .sort({ createdAt: -1 })
// //         .skip(skip)
// //         .limit(parseInt(limit))
// //         .populate('reviewedBy', 'firstName lastName email'),
// //       AdvertisingRequest.countDocuments(query),
// //     ]);

// //     return res.status(200).json({
// //       success: true,
// //       requests,
// //       pagination: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         total,
// //         pages: Math.ceil(total / parseInt(limit)),
// //       },
// //     });
// //   } catch (error) {
// //     logger.error('Get customer requests error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 10. SEND NOTIFICATION TO CUSTOMER (Admin Only)
// // // =============================================
// // export const sendCustomerNotification = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { title, message, priority = 'medium' } = req.body;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Invalid customer ID',
// //       });
// //     }

// //     if (!title || !message) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Title and message are required',
// //       });
// //     }

// //     const customer = await User.findOne({ _id: id, role: 'customer' });
// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Customer not found',
// //       });
// //     }

// //     const notification = new Notification({
// //       title,
// //       message,
// //       type: 'admin',
// //       priority,
// //       sentBy: req.userId,
// //       targetAudience: 'specific',
// //       targetUsers: [id],
// //       isActive: true,
// //       deleteAfter: '30days',
// //     });

// //     await notification.save();

// //     logger.info(`Notification sent to customer ${id} by admin ${req.userId}`);

// //     return res.status(201).json({
// //       success: true,
// //       message: 'Notification sent successfully',
// //       notification,
// //     });
// //   } catch (error) {
// //     logger.error('Send customer notification error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// // // =============================================
// // // 11. EXPORT CUSTOMERS DATA (Admin Only)
// // // =============================================
// // export const exportCustomers = async (req, res) => {
// //   try {
// //     const customers = await User.find({ role: 'customer' })
// //       .select('firstName lastName email phone isActive createdAt')
// //       .lean();

// //     const customerIds = customers.map(c => c._id);
// //     const requestCounts = await AdvertisingRequest.aggregate([
// //       { $match: { customerId: { $in: customerIds } } },
// //       { $group: { _id: '$customerId', count: { $sum: 1 } } }
// //     ]);

// //     const exportData = customers.map(customer => {
// //       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
// //       return {
// //         ...customer,
// //         requestCount: count ? count.count : 0,
// //         fullName: `${customer.firstName} ${customer.lastName}`,
// //       };
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       data: exportData,
// //       total: exportData.length,
// //     });
// //   } catch (error) {
// //     logger.error('Export customers error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       error: 'Internal server error',
// //     });
// //   }
// // };

// import User from '../../models/User.js';
// import Customer from '../../models/Customer.js';
// import AdvertisingRequest from '../../models/AdvertisingRequest.js';
// import Notification from '../../models/Notification.js';
// import { logger } from '../../utils/logger.js';
// import mongoose from 'mongoose';

// // =============================================
// // GET ALL CUSTOMERS (Admin Only)
// // =============================================
// export const getAllCustomers = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search, isActive } = req.query;

//     const query = { role: 'customer' };
//     if (isActive !== undefined) {
//       query.isActive = isActive === 'true';
//     }
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { companyName: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [customers, total] = await Promise.all([
//       Customer.find(query)
//         .select('-password -refreshToken')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Customer.countDocuments(query),
//     ]);

//     // Get request counts for each customer
//     const customerIds = customers.map(c => c._id);
//     const requestCounts = await AdvertisingRequest.aggregate([
//       { $match: { customerId: { $in: customerIds } } },
//       { $group: { _id: '$customerId', count: { $sum: 1 } } }
//     ]);

//     // Get request status counts
//     const requestStatusCounts = await AdvertisingRequest.aggregate([
//       { $match: { customerId: { $in: customerIds } } },
//       { $group: { 
//         _id: { customerId: '$customerId', status: '$status' }, 
//         count: { $sum: 1 } 
//       } }
//     ]);

//     const customersWithCounts = customers.map(customer => {
//       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
      
//       // Get status counts for this customer
//       const statuses = {};
//       requestStatusCounts
//         .filter(r => r._id.customerId.toString() === customer._id.toString())
//         .forEach(r => {
//           statuses[r._id.status] = r.count;
//         });

//       return {
//         ...customer.toObject(),
//         requestCount: count ? count.count : 0,
//         requestStatuses: statuses,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       customers: customersWithCounts,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get all customers error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // GET CUSTOMER BY ID (Admin Only)
// // =============================================
// export const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     const customer = await Customer.findOne({ _id: id, role: 'customer' })
//       .select('-password -refreshToken');

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         error: 'Customer not found',
//       });
//     }

//     // Get customer's advertising requests
//     const requests = await AdvertisingRequest.find({ customerId: id })
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .populate('reviewedBy', 'firstName lastName email');

//     // Get request statistics
//     const stats = await AdvertisingRequest.aggregate([
//       { $match: { customerId: new mongoose.Types.ObjectId(id) } },
//       { $group: { 
//         _id: '$status', 
//         count: { $sum: 1 } 
//       } }
//     ]);

//     const requestStats = {
//       total: 0,
//       pending: 0,
//       approved: 0,
//       rejected: 0,
//       in_production: 0,
//       completed: 0,
//       revision_required: 0,
//     };

//     stats.forEach(stat => {
//       requestStats[stat._id] = stat.count;
//       requestStats.total += stat.count;
//     });

//     return res.status(200).json({
//       success: true,
//       customer,
//       requests,
//       requestStats,
//     });
//   } catch (error) {
//     logger.error('Get customer by ID error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // UPDATE CUSTOMER (Admin Only)
// // =============================================
// export const updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     // Prevent updating sensitive fields
//     delete updates.password;
//     delete updates.refreshToken;
//     delete updates._id;
//     delete updates.createdAt;
//     delete updates.updatedAt;
//     delete updates.__v;
//     delete updates.role;

//     const customer = await Customer.findOneAndUpdate(
//       { _id: id, role: 'customer' },
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select('-password -refreshToken');

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         error: 'Customer not found',
//       });
//     }

//     logger.info(`Customer ${id} updated by admin`);

//     return res.status(200).json({
//       success: true,
//       message: 'Customer updated successfully',
//       customer,
//     });
//   } catch (error) {
//     logger.error('Update customer error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // TOGGLE CUSTOMER STATUS (Admin Only)
// // =============================================
// export const toggleCustomerStatus = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     const customer = await Customer.findOne({ _id: id, role: 'customer' });
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         error: 'Customer not found',
//       });
//     }

//     customer.isActive = !customer.isActive;
//     await customer.save();

//     logger.info(`Customer ${id} status toggled to ${customer.isActive} by admin`);

//     return res.status(200).json({
//       success: true,
//       message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
//       customer: {
//         _id: customer._id,
//         isActive: customer.isActive,
//         email: customer.email,
//         firstName: customer.firstName,
//         lastName: customer.lastName,
//         companyName: customer.companyName,
//       },
//     });
//   } catch (error) {
//     logger.error('Toggle customer status error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // DELETE CUSTOMER (Admin Only - Soft Delete)
// // =============================================
// export const deleteCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     const customer = await Customer.findOne({ _id: id, role: 'customer' });
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         error: 'Customer not found',
//       });
//     }

//     // Check if customer has active requests
//     const activeRequests = await AdvertisingRequest.countDocuments({
//       customerId: id,
//       status: { $in: ['pending', 'approved', 'in_production'] }
//     });

//     if (activeRequests > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Cannot delete customer with ${activeRequests} active requests. Complete or cancel them first.`,
//       });
//     }

//     // Soft delete
//     customer.isActive = false;
//     customer.deletedAt = new Date();
//     await customer.save();

//     logger.info(`Customer ${id} deactivated (soft delete) by admin`);

//     return res.status(200).json({
//       success: true,
//       message: 'Customer deactivated successfully',
//     });
//   } catch (error) {
//     logger.error('Delete customer error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // GET CUSTOMER STATISTICS (Admin Only)
// // =============================================
// export const getCustomerStatistics = async (req, res) => {
//   try {
//     const [total, active, inactive, totalRequests] = await Promise.all([
//       Customer.countDocuments({ role: 'customer' }),
//       Customer.countDocuments({ role: 'customer', isActive: true }),
//       Customer.countDocuments({ role: 'customer', isActive: false }),
//       AdvertisingRequest.countDocuments(),
//     ]);

//     // Get customers with most requests
//     const topCustomers = await AdvertisingRequest.aggregate([
//       { $group: { _id: '$customerId', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 5 },
//       { $lookup: {
//           from: 'customers',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'customer'
//         }},
//       { $unwind: '$customer' },
//       { $project: {
//           _id: 1,
//           count: 1,
//           'customer.firstName': 1,
//           'customer.lastName': 1,
//           'customer.email': 1,
//           'customer.companyName': 1,
//         }}
//     ]);

//     // Get requests by status
//     const requestsByStatus = await AdvertisingRequest.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     const statusStats = {};
//     requestsByStatus.forEach(stat => {
//       statusStats[stat._id] = stat.count;
//     });

//     return res.status(200).json({
//       success: true,
//       statistics: {
//         totalCustomers: total,
//         activeCustomers: active,
//         inactiveCustomers: inactive,
//         totalRequests,
//         requestsByStatus: statusStats,
//         topCustomers,
//       },
//     });
//   } catch (error) {
//     logger.error('Get customer statistics error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // GET CUSTOMER REQUESTS (Admin Only)
// // =============================================
// export const getCustomerRequests = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, page = 1, limit = 20 } = req.query;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     const query = { customerId: id };
//     if (status) query.status = status;

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [requests, total] = await Promise.all([
//       AdvertisingRequest.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('reviewedBy', 'firstName lastName email'),
//       AdvertisingRequest.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       success: true,
//       requests,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     logger.error('Get customer requests error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // SEND NOTIFICATION TO CUSTOMER (Admin Only)
// // =============================================
// export const sendCustomerNotification = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, message, priority = 'medium' } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid customer ID',
//       });
//     }

//     if (!title || !message) {
//       return res.status(400).json({
//         success: false,
//         error: 'Title and message are required',
//       });
//     }

//     const customer = await Customer.findOne({ _id: id, role: 'customer' });
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         error: 'Customer not found',
//       });
//     }

//     const notification = new Notification({
//       title,
//       message,
//       type: 'admin',
//       priority,
//       sentBy: req.userId,
//       targetAudience: 'specific',
//       targetUsers: [id],
//       isActive: true,
//       deleteAfter: '30days',
//     });

//     await notification.save();

//     logger.info(`Notification sent to customer ${id} by admin ${req.userId}`);

//     return res.status(201).json({
//       success: true,
//       message: 'Notification sent successfully',
//       notification,
//     });
//   } catch (error) {
//     logger.error('Send customer notification error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

// // =============================================
// // EXPORT CUSTOMERS DATA (Admin Only)
// // =============================================
// export const exportCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find({ role: 'customer' })
//       .select('firstName lastName email phone companyName companyIndustry isActive createdAt')
//       .lean();

//     const customerIds = customers.map(c => c._id);
//     const requestCounts = await AdvertisingRequest.aggregate([
//       { $match: { customerId: { $in: customerIds } } },
//       { $group: { _id: '$customerId', count: { $sum: 1 } } }
//     ]);

//     const exportData = customers.map(customer => {
//       const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
//       return {
//         ...customer,
//         requestCount: count ? count.count : 0,
//         fullName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: exportData,
//       total: exportData.length,
//     });
//   } catch (error) {
//     logger.error('Export customers error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// };

import Customer from '../../models/Customer.js';  // ✅ Use Customer model, NOT User
import AdvertisingRequest from '../../models/AdvertisingRequest.js';
import Notification from '../../models/Notification.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

// =============================================
// GET ALL CUSTOMERS (Admin Only)
// =============================================
export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;

    const query = {};
    // ✅ No role filter - all customers are in Customer model
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Customer.countDocuments(query),
    ]);

    // Get request counts for each customer
    const customerIds = customers.map(c => c._id);
    const requestCounts = await AdvertisingRequest.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { _id: '$customerId', count: { $sum: 1 } } }
    ]);

    // Get request status counts
    const requestStatusCounts = await AdvertisingRequest.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { 
        _id: { customerId: '$customerId', status: '$status' }, 
        count: { $sum: 1 } 
      } }
    ]);

    const customersWithCounts = customers.map(customer => {
      const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
      
      // Get status counts for this customer
      const statuses = {};
      requestStatusCounts
        .filter(r => r._id.customerId.toString() === customer._id.toString())
        .forEach(r => {
          statuses[r._id.status] = r.count;
        });

      return {
        ...customer.toObject(),
        requestCount: count ? count.count : 0,
        requestStatuses: statuses,
      };
    });

    return res.status(200).json({
      success: true,
      customers: customersWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get all customers error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET CUSTOMER BY ID (Admin Only)
// =============================================
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    const customer = await Customer.findById(id).select('-password -refreshToken');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    // Get customer's advertising requests
    const requests = await AdvertisingRequest.find({ customerId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('reviewedBy', 'firstName lastName email');

    // Get request statistics
    const stats = await AdvertisingRequest.aggregate([
      { $match: { customerId: new mongoose.Types.ObjectId(id) } },
      { $group: { 
        _id: '$status', 
        count: { $sum: 1 } 
      } }
    ]);

    const requestStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      in_production: 0,
      completed: 0,
      revision_required: 0,
    };

    stats.forEach(stat => {
      requestStats[stat._id] = stat.count;
      requestStats.total += stat.count;
    });

    return res.status(200).json({
      success: true,
      customer,
      requests,
      requestStats,
    });
  } catch (error) {
    logger.error('Get customer by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// UPDATE CUSTOMER (Admin Only)
// =============================================
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.refreshToken;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    logger.info(`Customer ${id} updated by admin`);

    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    logger.error('Update customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// TOGGLE CUSTOMER STATUS (Admin Only)
// =============================================
export const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    logger.info(`Customer ${id} status toggled to ${customer.isActive} by admin`);

    return res.status(200).json({
      success: true,
      message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
      customer: {
        _id: customer._id,
        isActive: customer.isActive,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        companyName: customer.companyName,
      },
    });
  } catch (error) {
    logger.error('Toggle customer status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE CUSTOMER (Admin Only - Soft Delete)
// =============================================
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    // Check if customer has active requests
    const activeRequests = await AdvertisingRequest.countDocuments({
      customerId: id,
      status: { $in: ['pending', 'approved', 'in_production'] }
    });

    if (activeRequests > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete customer with ${activeRequests} active requests. Complete or cancel them first.`,
      });
    }

    // Soft delete
    customer.isActive = false;
    customer.deletedAt = new Date();
    await customer.save();

    logger.info(`Customer ${id} deactivated (soft delete) by admin`);

    return res.status(200).json({
      success: true,
      message: 'Customer deactivated successfully',
    });
  } catch (error) {
    logger.error('Delete customer error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET CUSTOMER STATISTICS (Admin Only)
// =============================================
export const getCustomerStatistics = async (req, res) => {
  try {
    const [total, active, inactive, totalRequests] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ isActive: true }),
      Customer.countDocuments({ isActive: false }),
      AdvertisingRequest.countDocuments(),
    ]);

    // Get customers with most requests
    const topCustomers = await AdvertisingRequest.aggregate([
      { $group: { _id: '$customerId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }},
      { $unwind: '$customer' },
      { $project: {
          _id: 1,
          count: 1,
          'customer.firstName': 1,
          'customer.lastName': 1,
          'customer.email': 1,
          'customer.companyName': 1,
        }}
    ]);

    // Get requests by status
    const requestsByStatus = await AdvertisingRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusStats = {};
    requestsByStatus.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    return res.status(200).json({
      success: true,
      statistics: {
        totalCustomers: total,
        activeCustomers: active,
        inactiveCustomers: inactive,
        totalRequests,
        requestsByStatus: statusStats,
        topCustomers,
      },
    });
  } catch (error) {
    logger.error('Get customer statistics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET CUSTOMER REQUESTS (Admin Only)
// =============================================
export const getCustomerRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    const query = { customerId: id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      AdvertisingRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
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
    logger.error('Get customer requests error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// SEND NOTIFICATION TO CUSTOMER (Admin Only)
// =============================================
export const sendCustomerNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, priority = 'medium' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID',
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required',
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    const notification = new Notification({
      title,
      message,
      type: 'admin',
      priority,
      sentBy: req.userId,
      targetAudience: 'specific',
      targetUsers: [id],
      isActive: true,
      deleteAfter: '30days',
    });

    await notification.save();

    logger.info(`Notification sent to customer ${id} by admin ${req.userId}`);

    return res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification,
    });
  } catch (error) {
    logger.error('Send customer notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// EXPORT CUSTOMERS DATA (Admin Only)
// =============================================
export const exportCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .select('firstName lastName email phone companyName companyIndustry isActive createdAt')
      .lean();

    const customerIds = customers.map(c => c._id);
    const requestCounts = await AdvertisingRequest.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { _id: '$customerId', count: { $sum: 1 } } }
    ]);

    const exportData = customers.map(customer => {
      const count = requestCounts.find(r => r._id.toString() === customer._id.toString());
      return {
        ...customer,
        requestCount: count ? count.count : 0,
        fullName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      };
    });

    return res.status(200).json({
      success: true,
      data: exportData,
      total: exportData.length,
    });
  } catch (error) {
    logger.error('Export customers error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
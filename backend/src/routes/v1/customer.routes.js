
// // // // import express from 'express';
// // // // import { authenticate } from '../../middleware/auth.js';
// // // // import {
// // // //   createRequest,
// // // //   getMyRequests,
// // // //   getRequestById,
// // // //   updateRequest,
// // // //   deleteRequest,
// // // //   submitRequest,
// // // //   getProfile,
// // // //   updateProfile,
// // // //   getLatestAgreement,
// // // // } from '../../controllers/customer/customerController.js';

// // // // const router = express.Router();

// // // // // =============================================
// // // // // ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// // // // // =============================================
// // // // router.use(authenticate);

// // // // // =============================================
// // // // // ADVERTISING REQUESTS
// // // // // =============================================
// // // // router.post('/advertising', createRequest);
// // // // router.get('/advertising', getMyRequests);
// // // // router.get('/advertising/:id', getRequestById);
// // // // router.put('/advertising/:id', updateRequest);
// // // // router.delete('/advertising/:id', deleteRequest);
// // // // router.post('/advertising/:id/submit', submitRequest);

// // // // // =============================================
// // // // // PROFILE
// // // // // =============================================
// // // // router.get('/profile', getProfile);
// // // // router.put('/profile', updateProfile);

// // // // // =============================================
// // // // // AGREEMENT - ✅ ADD THIS ROUTE
// // // // // =============================================
// // // // router.get('/agreement/latest', getLatestAgreement);

// // // // export default router;

// // // import express from 'express';
// // // import { authenticate } from '../../middleware/auth.js';
// // // import {
// // //   createRequest,
// // //   getMyRequests,
// // //   getRequestById,
// // //   updateRequest,
// // //   deleteRequest,
// // //   submitRequest,
// // //   getProfile,
// // //   updateProfile,
// // //   getLatestAgreement,
// // // } from '../../controllers/customer/customerController.js';

// // // const router = express.Router();

// // // // =============================================
// // // // ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// // // // =============================================
// // // router.use(authenticate);

// // // // =============================================
// // // // ADVERTISING REQUESTS
// // // // =============================================
// // // router.post('/advertising', createRequest);
// // // router.get('/advertising', getMyRequests);
// // // router.get('/advertising/:id', getRequestById);
// // // router.put('/advertising/:id', updateRequest);
// // // router.delete('/advertising/:id', deleteRequest);
// // // router.post('/advertising/:id/submit', submitRequest);

// // // // =============================================
// // // // PROFILE
// // // // =============================================
// // // router.get('/profile', getProfile);
// // // router.put('/profile', updateProfile);

// // // // =============================================
// // // // AGREEMENT
// // // // =============================================
// // // router.get('/agreement/latest', getLatestAgreement);

// // // export default router;

// // import express from 'express';
// // import { authenticate } from '../../middleware/auth.js';
// // import {
// //   createRequest,
// //   getMyRequests,
// //   getRequestById,
// //   updateRequest,
// //   deleteRequest,
// //   submitRequest,
// //   getProfile,
// //   updateProfile,
// //   getLatestAgreement,
// // } from '../../controllers/customer/customerController.js';

// // const router = express.Router();

// // // =============================================
// // // ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// // // =============================================
// // router.use(authenticate);

// // // =============================================
// // // ADVERTISING REQUESTS
// // // =============================================
// // router.post('/advertising', createRequest);
// // router.get('/advertising', getMyRequests);
// // router.get('/advertising/:id', getRequestById);
// // router.put('/advertising/:id', updateRequest);
// // router.delete('/advertising/:id', deleteRequest);
// // router.post('/advertising/:id/submit', submitRequest);

// // // =============================================
// // // PROFILE
// // // =============================================
// // router.get('/profile', getProfile);
// // router.put('/profile', updateProfile);

// // // =============================================
// // // AGREEMENT
// // // =============================================
// // router.get('/agreement/latest', getLatestAgreement);

// // export default router;

// import express from 'express';
// import { authenticate } from '../../middleware/auth.js';
// import {
//   createRequest,
//   getMyRequests,
//   getRequestById,
//   updateRequest,
//   deleteRequest,
// } from '../../controllers/customer/customerController.js';

// const router = express.Router();

// // =============================================
// // ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// // =============================================
// router.use(authenticate);

// // =============================================
// // ADVERTISING REQUESTS (Customer Only)
// // =============================================

// // Create new advertising request
// router.post('/advertising', createRequest);

// // Get all my requests
// router.get('/advertising', getMyRequests);

// // Get single request by ID
// router.get('/advertising/:id', getRequestById);

// // Update request
// router.put('/advertising/:id', updateRequest);

// // Delete/cancel request
// router.delete('/advertising/:id', deleteRequest);

// export default router;
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  createRequest,
  getMyRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  submitRequest,
  getProfile,
  updateProfile,
} from '../../controllers/customer/customerController.js';

const router = express.Router();

// =============================================
// ALL ROUTES REQUIRE CUSTOMER AUTHENTICATION
// =============================================
router.use(authenticate);

// =============================================
// PROFILE MANAGEMENT
// =============================================
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// =============================================
// ADVERTISING REQUESTS
// =============================================
router.post('/advertising', createRequest);
router.get('/advertising', getMyRequests);
router.get('/advertising/:id', getRequestById);
router.put('/advertising/:id', updateRequest);
router.delete('/advertising/:id', deleteRequest);
router.post('/advertising/:id/submit', submitRequest);

export default router;
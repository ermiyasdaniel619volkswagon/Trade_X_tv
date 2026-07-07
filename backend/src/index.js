
// // // // // // import express from 'express';
// // // // // // import mongoose from 'mongoose';
// // // // // // import cors from 'cors';
// // // // // // import helmet from 'helmet';
// // // // // // import compression from 'compression';
// // // // // // import morgan from 'morgan';
// // // // // // import dotenv from 'dotenv';
// // // // // // import { createServer } from 'http';

// // // // // // import authRoutes from './routes/v1/auth.routes.js';
// // // // // // import reportRoutes from './routes/v1/report.routes.js';
// // // // // // import adminRoutes from './routes/v1/admin.routes.js';
// // // // // // // import userRoutes from './routes/v1/user.routes.js';
// // // // // // import notificationRoutes from './routes/v1/notification.routes.js';
// // // // // // import videoRoutes from './routes/v1/video.routes.js';
// // // // // // import publicRoutes from './routes/v1/public.routes.js';
// // // // // // import heroRoutes from './routes/v1/hero.routes.js';
// // // // // // // import statsRoutes from './routes/v1/stats.routes.js';
// // // // // // import newsRoutes from './routes/v1/news.routes.js';
// // // // // // import blogRoutes from './routes/v1/blog.routes.js';
// // // // // // import { errorHandler } from './middleware/errorHandler.js';
// // // // // // import { logger } from './utils/logger.js';
// // // // // // import { createAdminIfNotExists } from './services/authService.js';
// // // // // // import { scheduleCleanup } from './services/cleanupService.js';
// // // // // // import customerRoutes from './routes/v1/customer.routes.js';
// // // // // // import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';
// // // // // // dotenv.config();

// // // // // // const app = express();
// // // // // // const server = createServer(app);
// // // // // // const PORT = process.env.PORT || 5000;

// // // // // // // =============================================
// // // // // // // CORS Configuration
// // // // // // // =============================================
// // // // // // const corsOptions = {
// // // // // //   origin: [
// // // // // //     'http://localhost:3000',
// // // // // //     'http://127.0.0.1:3000',
// // // // // //     'http://localhost:5173',
// // // // // //     'http://127.0.0.1:5173',
// // // // // //     process.env.CORS_ORIGIN || '*'
// // // // // //   ],
// // // // // //   credentials: true,
// // // // // //   optionsSuccessStatus: 200,
// // // // // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
// // // // // //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // // // // // };

// // // // // // app.use(cors(corsOptions));
// // // // // // app.options('*', cors(corsOptions));

// // // // // // // =============================================
// // // // // // // Security Middleware
// // // // // // // =============================================
// // // // // // app.use(helmet({
// // // // // //   crossOriginResourcePolicy: { policy: "cross-origin" },
// // // // // //   crossOriginOpenerPolicy: { policy: "unsafe-none" },
// // // // // //   contentSecurityPolicy: false,
// // // // // // }));

// // // // // // app.use(compression());
// // // // // // app.use(morgan('combined'));

// // // // // // app.use(express.json({ limit: '10mb' }));
// // // // // // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // // // // // =============================================
// // // // // // // Health Check - Public
// // // // // // // =============================================
// // // // // // app.get('/health', (req, res) => {
// // // // // //   return res.status(200).json({
// // // // // //     status: 'ok',
// // // // // //     timestamp: new Date().toISOString(),
// // // // // //     uptime: process.uptime(),
// // // // // //     environment: process.env.NODE_ENV,
// // // // // //   });
// // // // // // });

// // // // // // // =============================================
// // // // // // // ✅ PUBLIC ROUTES - NO authentication required
// // // // // // // These must be registered BEFORE any auth middleware
// // // // // // // =============================================
// // // // // // app.use('/api/v1/public', publicRoutes);
// // // // // // app.use('/api/v1/public/hero', heroRoutes);
// // // // // // // app.use('/api/v1/stats/public', statsRoutes); // ✅ This is the fix!

// // // // // // // =============================================
// // // // // // // API Routes (Protected - require authentication)
// // // // // // // =============================================
// // // // // // app.use('/api/v1/auth', authRoutes);
// // // // // // app.use('/api/v1/reports', reportRoutes);
// // // // // // app.use('/api/v1/admin', adminRoutes);
// // // // // // // app.use('/api/v1/users', userRoutes);
// // // // // // app.use('/api/v1/notifications', notificationRoutes);
// // // // // // app.use('/api/v1/admin/videos', videoRoutes);
// // // // // // app.use('/api/v1/admin/hero', heroRoutes);
// // // // // // app.use('/api/v1/news', newsRoutes);
// // // // // // app.use('/api/v1/blogs', blogRoutes);

// // // // // // app.use('/api/v1/customer', customerRoutes);
// // // // // // app.use('/api/v1/admin/customer', adminCustomerRoutes)

// // // // // // // =============================================
// // // // // // // 404 Handler
// // // // // // // =============================================
// // // // // // app.use((req, res) => {
// // // // // //   return res.status(404).json({
// // // // // //     success: false,
// // // // // //     error: 'Route not found',
// // // // // //     path: req.originalUrl,
// // // // // //   });
// // // // // // });

// // // // // // app.use(errorHandler);

// // // // // // // =============================================
// // // // // // // Database Connection
// // // // // // // =============================================
// // // // // // const connectDB = async () => {
// // // // // //   try {
// // // // // //     await mongoose.connect(process.env.MONGODB_URI, {
// // // // // //       serverSelectionTimeoutMS: 5000,
// // // // // //       socketTimeoutMS: 45000,
// // // // // //     });
// // // // // //     logger.info('✅ MongoDB connected successfully');
// // // // // //     await createAdminIfNotExists();
    
// // // // // //     scheduleCleanup();
// // // // // //     logger.info('🧹 Cleanup service started (runs every 5 minutes)');
// // // // // //   } catch (error) {
// // // // // //     logger.error('❌ MongoDB connection error:', error.message);
// // // // // //     process.exit(1);
// // // // // //   }
// // // // // // };

// // // // // // // =============================================
// // // // // // // Start Server
// // // // // // // =============================================
// // // // // // const startServer = async () => {
// // // // // //   await connectDB();
  
// // // // // //   server.listen(PORT, '0.0.0.0', () => {
// // // // // //     logger.info(`🚀 Server running on port ${PORT}`);
// // // // // //     logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
// // // // // //     logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
// // // // // //   });
// // // // // // };

// // // // // // // =============================================
// // // // // // // Graceful Shutdown
// // // // // // // =============================================
// // // // // // process.on('SIGTERM', () => {
// // // // // //   logger.info('SIGTERM received, closing server...');
// // // // // //   server.close(() => {
// // // // // //     mongoose.connection.close(false, () => {
// // // // // //       logger.info('Server closed');
// // // // // //       process.exit(0);
// // // // // //     });
// // // // // //   });
// // // // // // });

// // // // // // process.on('SIGINT', () => {
// // // // // //   logger.info('SIGINT received, closing server...');
// // // // // //   server.close(() => {
// // // // // //     mongoose.connection.close(false, () => {
// // // // // //       logger.info('Server closed');
// // // // // //       process.exit(0);
// // // // // //     });
// // // // // //   });
// // // // // // });

// // // // // // startServer();

// // // // // // export default app;

// // // // // import express from 'express';
// // // // // import mongoose from 'mongoose';
// // // // // import cors from 'cors';
// // // // // import helmet from 'helmet';
// // // // // import compression from 'compression';
// // // // // import morgan from 'morgan';
// // // // // import dotenv from 'dotenv';
// // // // // import { createServer } from 'http';

// // // // // import authRoutes from './routes/v1/auth.routes.js';
// // // // // import reportRoutes from './routes/v1/report.routes.js';
// // // // // import adminRoutes from './routes/v1/admin.routes.js';
// // // // // import notificationRoutes from './routes/v1/notification.routes.js';
// // // // // import videoRoutes from './routes/v1/video.routes.js';
// // // // // import publicRoutes from './routes/v1/public.routes.js';
// // // // // import heroRoutes from './routes/v1/hero.routes.js';
// // // // // import newsRoutes from './routes/v1/news.routes.js';
// // // // // import blogRoutes from './routes/v1/blog.routes.js';
// // // // // import { errorHandler } from './middleware/errorHandler.js';
// // // // // import { logger } from './utils/logger.js';
// // // // // import { createAdminIfNotExists } from './services/authService.js';
// // // // // import { scheduleCleanup } from './services/cleanupService.js';
// // // // // import customerRoutes from './routes/v1/customer.routes.js';
// // // // // import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';

// // // // // dotenv.config();

// // // // // const app = express();
// // // // // const server = createServer(app);
// // // // // const PORT = process.env.PORT || 5000;

// // // // // // =============================================
// // // // // // CORS Configuration
// // // // // // =============================================
// // // // // const corsOptions = {
// // // // //   origin: [
// // // // //     'http://localhost:3000',
// // // // //     'http://127.0.0.1:3000',
// // // // //     'http://localhost:5173',
// // // // //     'http://127.0.0.1:5173',
// // // // //     process.env.CORS_ORIGIN || '*'
// // // // //   ],
// // // // //   credentials: true,
// // // // //   optionsSuccessStatus: 200,
// // // // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
// // // // //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // // // // };

// // // // // app.use(cors(corsOptions));
// // // // // app.options('*', cors(corsOptions));

// // // // // // =============================================
// // // // // // Security & Utility Middleware
// // // // // // =============================================
// // // // // app.use(helmet({
// // // // //   crossOriginResourcePolicy: { policy: "cross-origin" },
// // // // //   crossOriginOpenerPolicy: { policy: "unsafe-none" },
// // // // //   contentSecurityPolicy: false,
// // // // // }));

// // // // // app.use(compression());
// // // // // app.use(morgan('combined'));

// // // // // app.use(express.json({ limit: '10mb' }));
// // // // // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // // // // =============================================
// // // // // // Serverless Database Middleware Connection
// // // // // // This guarantees we have a connection established 
// // // // // // for every API request without timing out serverless container initializations.
// // // // // // =============================================
// // // // // const connectDB = async () => {
// // // // //   // If we already have an active database connection, reuse it.
// // // // //   if (mongoose.connection.readyState === 1) {
// // // // //     return;
// // // // //   }
  
// // // // //   try {
// // // // //     await mongoose.connect(process.env.MONGODB_URI, {
// // // // //       serverSelectionTimeoutMS: 5000,
// // // // //       socketTimeoutMS: 45000,
// // // // //     });
// // // // //     logger.info('✅ MongoDB connected successfully');
    
// // // // //     // Core administration initialization setup
// // // // //     await createAdminIfNotExists();
    
// // // // //     // Run cleanup background setups ONLY if not running on serverless Vercel environment
// // // // //     if (process.env.VERCEL !== '1') {
// // // // //       scheduleCleanup();
// // // // //       logger.info('🧹 Cleanup service started (runs every 5 minutes)');
// // // // //     }
// // // // //   } catch (error) {
// // // // //     logger.error('❌ MongoDB connection error:', error.message);
// // // // //     if (process.env.VERCEL !== '1') {
// // // // //       process.exit(1);
// // // // //     }
// // // // //     throw error;
// // // // //   }
// // // // // };

// // // // // // Global interceptor to guarantee DB connectivity on Serverless invocations
// // // // // app.use(async (req, res, next) => {
// // // // //   try {
// // // // //     await connectDB();
// // // // //     next();
// // // // //   } catch (err) {
// // // // //     next(err);
// // // // //   }
// // // // // });

// // // // // // =============================================
// // // // // // Health Check - Public
// // // // // // =============================================
// // // // // app.get('/health', (req, res) => {
// // // // //   return res.status(200).json({
// // // // //     status: 'ok',
// // // // //     timestamp: new Date().toISOString(),
// // // // //     uptime: process.uptime(),
// // // // //     environment: process.env.NODE_ENV,
// // // // //   });
// // // // // });

// // // // // // =============================================
// // // // // // PUBLIC ROUTES
// // // // // // =============================================
// // // // // app.use('/api/v1/public', publicRoutes);
// // // // // app.use('/api/v1/public/hero', heroRoutes);

// // // // // // =============================================
// // // // // // API Routes (Protected)
// // // // // // =============================================
// // // // // app.use('/api/v1/auth', authRoutes);
// // // // // app.use('/api/v1/reports', reportRoutes);
// // // // // app.use('/api/v1/admin', adminRoutes);
// // // // // app.use('/api/v1/notifications', notificationRoutes);
// // // // // app.use('/api/v1/admin/videos', videoRoutes);
// // // // // app.use('/api/v1/admin/hero', heroRoutes);
// // // // // app.use('/api/v1/news', newsRoutes);
// // // // // app.use('/api/v1/blogs', blogRoutes);
// // // // // app.use('/api/v1/customer', customerRoutes);
// // // // // app.use('/api/v1/admin/customer', adminCustomerRoutes);

// // // // // // =============================================
// // // // // // 404 Handler
// // // // // // =============================================
// // // // // app.use((req, res) => {
// // // // //   return res.status(404).json({
// // // // //     success: false,
// // // // //     error: 'Route not found',
// // // // //     path: req.originalUrl,
// // // // //   });
// // // // // });

// // // // // app.use(errorHandler);

// // // // // // =============================================
// // // // // // Local Development Mode Handler
// // // // // // Only binds a local network port if NOT hosted inside Vercel.
// // // // // // =============================================
// // // // // if (process.env.VERCEL !== '1') {
// // // // //   connectDB().then(() => {
// // // // //     server.listen(PORT, '0.0.0.0', () => {
// // // // //       logger.info(`🚀 Local Server running on port ${PORT}`);
// // // // //       logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
// // // // //     });
// // // // //   });

// // // // //   // Graceful Shutdown Events (Only applicable to explicit continuous processes)
// // // // //   const gracefulShutdown = (signal) => {
// // // // //     logger.info(`${signal} received, closing server...`);
// // // // //     server.close(() => {
// // // // //       mongoose.connection.close(false, () => {
// // // // //         logger.info('Server closed');
// // // // //         process.exit(0);
// // // // //       });
// // // // //     });
// // // // //   };

// // // // //   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// // // // //   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// // // // // }

// // // // // // Export default app for Vercel Serverless handling engine
// // // // // export default app;

// // // // import express from 'express';
// // // // import mongoose from 'mongoose';
// // // // import cors from 'cors';
// // // // import helmet from 'helmet';
// // // // import compression from 'compression';
// // // // import morgan from 'morgan';
// // // // import dotenv from 'dotenv';
// // // // import { createServer } from 'http';

// // // // import authRoutes from './routes/v1/auth.routes.js';
// // // // import reportRoutes from './routes/v1/report.routes.js';
// // // // import adminRoutes from './routes/v1/admin.routes.js';
// // // // import notificationRoutes from './routes/v1/notification.routes.js';
// // // // import videoRoutes from './routes/v1/video.routes.js';
// // // // import publicRoutes from './routes/v1/public.routes.js';
// // // // import heroRoutes from './routes/v1/hero.routes.js';
// // // // import newsRoutes from './routes/v1/news.routes.js';
// // // // import blogRoutes from './routes/v1/blog.routes.js';
// // // // import { errorHandler } from './middleware/errorHandler.js';
// // // // import { logger } from './utils/logger.js';
// // // // import { createAdminIfNotExists } from './services/authService.js';
// // // // import { scheduleCleanup } from './services/cleanupService.js';
// // // // import customerRoutes from './routes/v1/customer.routes.js';
// // // // import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';

// // // // dotenv.config();

// // // // const app = express();
// // // // const server = createServer(app);
// // // // const PORT = process.env.PORT || 5000;

// // // // // =============================================
// // // // // CORS Configuration
// // // // // =============================================
// // // // const corsOptions = {
// // // //   origin: [
// // // //     'http://localhost:3000',
// // // //     'http://127.0.0.1:3000',
// // // //     'http://localhost:5173',
// // // //     'http://127.0.0.1:5173',
// // // //     process.env.CORS_ORIGIN || '*'
// // // //   ],
// // // //   credentials: true,
// // // //   optionsSuccessStatus: 200,
// // // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
// // // //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // // // };

// // // // app.use(cors(corsOptions));
// // // // app.options('*', cors(corsOptions));

// // // // // =============================================
// // // // // Security & Utility Middleware
// // // // // =============================================
// // // // app.use(helmet({
// // // //   crossOriginResourcePolicy: { policy: "cross-origin" },
// // // //   crossOriginOpenerPolicy: { policy: "unsafe-none" },
// // // //   contentSecurityPolicy: false,
// // // // }));

// // // // app.use(compression());
// // // // app.use(morgan('combined'));

// // // // app.use(express.json({ limit: '10mb' }));
// // // // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // // // =============================================
// // // // // Serverless Database Middleware Connection
// // // // // =============================================
// // // // const connectDB = async () => {
// // // //   if (mongoose.connection.readyState === 1) {
// // // //     return;
// // // //   }
  
// // // //   try {
// // // //     await mongoose.connect(process.env.MONGODB_URI, {
// // // //       serverSelectionTimeoutMS: 5000,
// // // //       socketTimeoutMS: 45000,
// // // //     });
// // // //     logger.info('✅ MongoDB connected successfully');
    
// // // //     await createAdminIfNotExists();
    
// // // //     if (process.env.VERCEL !== '1') {
// // // //       scheduleCleanup();
// // // //       logger.info('🧹 Cleanup service started (runs every 5 minutes)');
// // // //     }
// // // //   } catch (error) {
// // // //     logger.error('❌ MongoDB connection error:', error.message);
// // // //     if (process.env.VERCEL !== '1') {
// // // //       process.exit(1);
// // // //     }
// // // //     throw error;
// // // //   }
// // // // };

// // // // // Global interceptor to guarantee DB connectivity on Serverless invocations
// // // // app.use(async (req, res, next) => {
// // // //   try {
// // // //     await connectDB();
// // // //     next();
// // // //   } catch (err) {
// // // //     next(err);
// // // //   }
// // // // });

// // // // // =============================================
// // // // // Deployment Confirmation & Health Check
// // // // // =============================================

// // // // // Root landing route to verify successful deployment instantly in your browser
// // // // app.get('/', (req, res) => {
// // // //   return res.status(200).json({
// // // //     success: true,
// // // //     message: '🚀 TradExTV Portal Backend Deployment is Fully Successful!',
// // // //     environment: process.env.VERCEL === '1' ? 'Vercel Serverless Cloud' : 'Local Machine',
// // // //     databaseStatus: 'Connected & Authenticated',
// // // //     timestamp: new Date().toISOString()
// // // //   });
// // // // });

// // // // app.get('/health', (req, res) => {
// // // //   return res.status(200).json({
// // // //     status: 'ok',
// // // //     timestamp: new Date().toISOString(),
// // // //     uptime: process.uptime(),
// // // //     environment: process.env.NODE_ENV,
// // // //   });
// // // // });

// // // // // =============================================
// // // // // PUBLIC ROUTES
// // // // // =============================================
// // // // app.use('/api/v1/public', publicRoutes);
// // // // app.use('/api/v1/public/hero', heroRoutes);

// // // // // =============================================
// // // // // API Routes (Protected)
// // // // // =============================================
// // // // app.use('/api/v1/auth', authRoutes);
// // // // app.use('/api/v1/reports', reportRoutes);
// // // // app.use('/api/v1/admin', adminRoutes);
// // // // app.use('/api/v1/notifications', notificationRoutes);
// // // // app.use('/api/v1/admin/videos', videoRoutes);
// // // // app.use('/api/v1/admin/hero', heroRoutes);
// // // // app.use('/api/v1/news', newsRoutes);
// // // // app.use('/api/v1/blogs', blogRoutes);
// // // // app.use('/api/v1/customer', customerRoutes);
// // // // app.use('/api/v1/admin/customer', adminCustomerRoutes);

// // // // // =============================================
// // // // // 404 Handler
// // // // // =============================================
// // // // app.use((req, res) => {
// // // //   return res.status(404).json({
// // // //     success: false,
// // // //     error: 'Route not found',
// // // //     path: req.originalUrl,
// // // //   });
// // // // });

// // // // app.use(errorHandler);

// // // // // =============================================
// // // // // Local Development Mode Handler
// // // // // =============================================
// // // // if (process.env.VERCEL !== '1') {
// // // //   connectDB().then(() => {
// // // //     server.listen(PORT, '0.0.0.0', () => {
// // // //       logger.info(`🚀 Local Server running on port ${PORT}`);
// // // //       logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
// // // //     });
// // // //   });

// // // //   const gracefulShutdown = (signal) => {
// // // //     logger.info(`${signal} received, closing server...`);
// // // //     server.close(() => {
// // // //       mongoose.connection.close(false, () => {
// // // //         logger.info('Server closed');
// // // //         process.exit(0);
// // // //       });
// // // //     });
// // // //   };

// // // //   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// // // //   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// // // // }

// // // // export default app;

// // // import express from 'express';
// // // import mongoose from 'mongoose';
// // // import cors from 'cors';
// // // import helmet from 'helmet';
// // // import compression from 'compression';
// // // import morgan from 'morgan';
// // // import dotenv from 'dotenv';
// // // import { createServer } from 'http';

// // // import authRoutes from './routes/v1/auth.routes.js';
// // // import reportRoutes from './routes/v1/report.routes.js';
// // // import adminRoutes from './routes/v1/admin.routes.js';
// // // import notificationRoutes from './routes/v1/notification.routes.js';
// // // import videoRoutes from './routes/v1/video.routes.js';
// // // import publicRoutes from './routes/v1/public.routes.js';
// // // import heroRoutes from './routes/v1/hero.routes.js';
// // // import newsRoutes from './routes/v1/news.routes.js';
// // // import blogRoutes from './routes/v1/blog.routes.js';
// // // import { errorHandler } from './middleware/errorHandler.js';
// // // import { logger } from './utils/logger.js';
// // // import { createAdminIfNotExists } from './services/authService.js';
// // // import { scheduleCleanup } from './services/cleanupService.js';
// // // import customerRoutes from './routes/v1/customer.routes.js';
// // // import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';

// // // dotenv.config();

// // // const app = express();
// // // const server = createServer(app);
// // // const PORT = process.env.PORT || 5000;

// // // // =============================================
// // // // CORS Configuration
// // // // =============================================
// // // const corsOptions = {
// // //   origin: [
// // //     'http://localhost:3000',
// // //     'http://127.0.0.1:3000',
// // //     'http://localhost:5173',
// // //     'http://127.0.0.1:5173',
// // //     process.env.CORS_ORIGIN || '*'
// // //   ],
// // //   credentials: true,
// // //   optionsSuccessStatus: 200,
// // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
// // //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // // };

// // // app.use(cors(corsOptions));
// // // app.options('*', cors(corsOptions));

// // // // =============================================
// // // // Security & Utility Middleware
// // // // =============================================
// // // app.use(helmet({
// // //   crossOriginResourcePolicy: { policy: "cross-origin" },
// // //   crossOriginOpenerPolicy: { policy: "unsafe-none" },
// // //   contentSecurityPolicy: false,
// // // }));

// // // app.use(compression());
// // // app.use(morgan('combined'));

// // // app.use(express.json({ limit: '10mb' }));
// // // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // // =============================================
// // // // Serverless Database Middleware Connection
// // // // =============================================
// // // const connectDB = async () => {
// // //   if (mongoose.connection.readyState === 1) {
// // //     return;
// // //   }
  
// // //   try {
// // //     await mongoose.connect(process.env.MONGODB_URI, {
// // //       serverSelectionTimeoutMS: 5000,
// // //       socketTimeoutMS: 45000,
// // //     });
// // //     logger.info('✅ MongoDB connected successfully');
    
// // //     await createAdminIfNotExists();
    
// // //     if (process.env.VERCEL !== '1') {
// // //       scheduleCleanup();
// // //       logger.info('🧹 Cleanup service started (runs every 5 minutes)');
// // //     }
// // //   } catch (error) {
// // //     logger.error('❌ MongoDB connection error:', error.message);
// // //     if (process.env.VERCEL !== '1') {
// // //       process.exit(1);
// // //     }
// // //     throw error;
// // //   }
// // // };

// // // // Global interceptor to guarantee DB connectivity on Serverless invocations
// // // app.use(async (req, res, next) => {
// // //   try {
// // //     await connectDB();
// // //     next();
// // //   } catch (err) {
// // //     next(err);
// // //   }
// // // });

// // // // =============================================
// // // // Deployment Confirmation & Health Check
// // // // =============================================

// // // // Root landing route to verify successful deployment instantly in your browser
// // // app.get('/', (req, res) => {
// // //   return res.status(200).json({
// // //     success: true,
// // //     message: '🚀 TradExTV Portal Backend Deployment is Fully Successful!',
// // //     environment: process.env.VERCEL === '1' ? 'Vercel Serverless Cloud' : 'Local Machine',
// // //     databaseStatus: 'Connected & Authenticated',
// // //     timestamp: new Date().toISOString()
// // //   });
// // // });

// // // app.get('/health', (req, res) => {
// // //   return res.status(200).json({
// // //     status: 'ok',
// // //     timestamp: new Date().toISOString(),
// // //     uptime: process.uptime(),
// // //     environment: process.env.NODE_ENV,
// // //   });
// // // });

// // // // =============================================
// // // // PUBLIC ROUTES
// // // // =============================================
// // // app.use('/api/v1/public', publicRoutes);
// // // app.use('/api/v1/public/hero', heroRoutes);

// // // // =============================================
// // // // API Routes (Protected)
// // // // =============================================
// // // app.use('/api/v1/auth', authRoutes);                         // Auth routes
// // // app.use('/api/v1/reports', reportRoutes);                    // Report routes
// // // app.use('/api/v1/admin', adminRoutes);                       // Admin - Advertising management only
// // // app.use('/api/v1/notifications', notificationRoutes);        // Notification routes
// // // app.use('/api/v1/admin/videos', videoRoutes);                // Admin - Video management
// // // app.use('/api/v1/admin/hero', heroRoutes);                   // Admin - Hero management
// // // app.use('/api/v1/news', newsRoutes);                         // News routes
// // // app.use('/api/v1/blogs', blogRoutes);                        // Blog routes
// // // app.use('/api/v1/customer', customerRoutes);                 // Customer - Advertising requests only
// // // app.use('/api/v1/admin/customer', adminCustomerRoutes);      // Admin - Customer management only

// // // // =============================================
// // // // 404 Handler
// // // // =============================================
// // // app.use((req, res) => {
// // //   return res.status(404).json({
// // //     success: false,
// // //     error: 'Route not found',
// // //     path: req.originalUrl,
// // //   });
// // // });

// // // app.use(errorHandler);

// // // // =============================================
// // // // Local Development Mode Handler
// // // // =============================================
// // // if (process.env.VERCEL !== '1') {
// // //   connectDB().then(() => {
// // //     server.listen(PORT, '0.0.0.0', () => {
// // //       logger.info(`🚀 Local Server running on port ${PORT}`);
// // //       logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
// // //     });
// // //   });

// // //   const gracefulShutdown = (signal) => {
// // //     logger.info(`${signal} received, closing server...`);
// // //     server.close(() => {
// // //       mongoose.connection.close(false, () => {
// // //         logger.info('Server closed');
// // //         process.exit(0);
// // //       });
// // //     });
// // //   };

// // //   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// // //   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// // // }

// // // export default app;

// // import express from 'express';
// // import mongoose from 'mongoose';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import compression from 'compression';
// // import morgan from 'morgan';
// // import dotenv from 'dotenv';
// // import { createServer } from 'http';

// // import authRoutes from './routes/v1/auth.routes.js';
// // import reportRoutes from './routes/v1/report.routes.js';
// // import adminRoutes from './routes/v1/admin.routes.js';
// // import advertisingRoutes from './routes/v1/advertising.routes.js';  // ✅ NEW
// // import notificationRoutes from './routes/v1/notification.routes.js';
// // import videoRoutes from './routes/v1/video.routes.js';
// // import publicRoutes from './routes/v1/public.routes.js';
// // import heroRoutes from './routes/v1/hero.routes.js';
// // import newsRoutes from './routes/v1/news.routes.js';
// // import blogRoutes from './routes/v1/blog.routes.js';
// // import { errorHandler } from './middleware/errorHandler.js';
// // import { logger } from './utils/logger.js';
// // import { createAdminIfNotExists } from './services/authService.js';
// // import { scheduleCleanup } from './services/cleanupService.js';
// // import customerRoutes from './routes/v1/customer.routes.js';
// // import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';

// // dotenv.config();

// // const app = express();
// // const server = createServer(app);
// // const PORT = process.env.PORT || 5000;

// // // =============================================
// // // CORS Configuration
// // // =============================================
// // const corsOptions = {
// //   origin: [
// //     'http://localhost:3000',
// //     'http://127.0.0.1:3000',
// //     'http://localhost:5173',
// //     'http://127.0.0.1:5173',
// //     process.env.CORS_ORIGIN || '*'
// //   ],
// //   credentials: true,
// //   optionsSuccessStatus: 200,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // };

// // app.use(cors(corsOptions));
// // app.options('*', cors(corsOptions));

// // // =============================================
// // // Security & Utility Middleware
// // // =============================================
// // app.use(helmet({
// //   crossOriginResourcePolicy: { policy: "cross-origin" },
// //   crossOriginOpenerPolicy: { policy: "unsafe-none" },
// //   contentSecurityPolicy: false,
// // }));

// // app.use(compression());
// // app.use(morgan('combined'));

// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // =============================================
// // // Serverless Database Middleware Connection
// // // =============================================
// // const connectDB = async () => {
// //   if (mongoose.connection.readyState === 1) {
// //     return;
// //   }
  
// //   try {
// //     await mongoose.connect(process.env.MONGODB_URI, {
// //       serverSelectionTimeoutMS: 5000,
// //       socketTimeoutMS: 45000,
// //     });
// //     logger.info('✅ MongoDB connected successfully');
    
// //     await createAdminIfNotExists();
    
// //     if (process.env.VERCEL !== '1') {
// //       scheduleCleanup();
// //       logger.info('🧹 Cleanup service started (runs every 5 minutes)');
// //     }
// //   } catch (error) {
// //     logger.error('❌ MongoDB connection error:', error.message);
// //     if (process.env.VERCEL !== '1') {
// //       process.exit(1);
// //     }
// //     throw error;
// //   }
// // };

// // // Global interceptor to guarantee DB connectivity on Serverless invocations
// // app.use(async (req, res, next) => {
// //   try {
// //     await connectDB();
// //     next();
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // // =============================================
// // // Deployment Confirmation & Health Check
// // // =============================================

// // app.get('/', (req, res) => {
// //   return res.status(200).json({
// //     success: true,
// //     message: '🚀 TradExTV Portal Backend Deployment is Fully Successful!',
// //     environment: process.env.VERCEL === '1' ? 'Vercel Serverless Cloud' : 'Local Machine',
// //     databaseStatus: 'Connected & Authenticated',
// //     timestamp: new Date().toISOString()
// //   });
// // });

// // app.get('/health', (req, res) => {
// //   return res.status(200).json({
// //     status: 'ok',
// //     timestamp: new Date().toISOString(),
// //     uptime: process.uptime(),
// //     environment: process.env.NODE_ENV,
// //   });
// // });

// // // =============================================
// // // PUBLIC ROUTES
// // // =============================================
// // app.use('/api/v1/public', publicRoutes);
// // app.use('/api/v1/public/hero', heroRoutes);

// // // =============================================
// // // API Routes (Protected)
// // // =============================================
// // app.use('/api/v1/auth', authRoutes);                         // Auth routes
// // app.use('/api/v1/reports', reportRoutes);                    // Report routes
// // app.use('/api/v1/admin', adminRoutes);                       // Admin - Reports & Users
// // app.use('/api/v1/admin', advertisingRoutes);                 // Admin - Advertising management
// // app.use('/api/v1/admin/customer', adminCustomerRoutes);      // Admin - Customer management
// // app.use('/api/v1/notifications', notificationRoutes);        // Notification routes
// // app.use('/api/v1/admin/videos', videoRoutes);                // Admin - Video management
// // app.use('/api/v1/admin/hero', heroRoutes);                   // Admin - Hero management
// // app.use('/api/v1/news', newsRoutes);                         // News routes
// // app.use('/api/v1/blogs', blogRoutes);                        // Blog routes
// // app.use('/api/v1/customer', customerRoutes);                 // Customer - Advertising requests

// // // =============================================
// // // 404 Handler
// // // =============================================
// // app.use((req, res) => {
// //   return res.status(404).json({
// //     success: false,
// //     error: 'Route not found',
// //     path: req.originalUrl,
// //   });
// // });

// // app.use(errorHandler);

// // // =============================================
// // // Local Development Mode Handler
// // // =============================================
// // if (process.env.VERCEL !== '1') {
// //   connectDB().then(() => {
// //     server.listen(PORT, '0.0.0.0', () => {
// //       logger.info(`🚀 Local Server running on port ${PORT}`);
// //       logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
// //     });
// //   });

// //   const gracefulShutdown = (signal) => {
// //     logger.info(`${signal} received, closing server...`);
// //     server.close(() => {
// //       mongoose.connection.close(false, () => {
// //         logger.info('Server closed');
// //         process.exit(0);
// //       });
// //     });
// //   };

// //   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// //   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// // }

// // export default app;

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import { createServer } from 'http';

// import authRoutes from './routes/v1/auth.routes.js';
// import reportRoutes from './routes/v1/report.routes.js';
// import adminRoutes from './routes/v1/admin.routes.js';
// import notificationRoutes from './routes/v1/notification.routes.js';
// import videoRoutes from './routes/v1/video.routes.js';
// import publicRoutes from './routes/v1/public.routes.js';
// import heroRoutes from './routes/v1/hero.routes.js';
// import newsRoutes from './routes/v1/news.routes.js';
// import blogRoutes from './routes/v1/blog.routes.js';
// import { errorHandler } from './middleware/errorHandler.js';
// import { logger } from './utils/logger.js';
// import { createAdminIfNotExists } from './services/authService.js';
// import { scheduleCleanup } from './services/cleanupService.js';
// import customerRoutes from './routes/v1/customer.routes.js';
// import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';  // ✅ KEEP THIS

// dotenv.config();

// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 5000;

// // =============================================
// // CORS Configuration
// // =============================================
// const corsOptions = {
//   origin: [
//     'http://localhost:3000',
//     'http://127.0.0.1:3000',
//     'http://localhost:5173',
//     'http://127.0.0.1:5173',
//     process.env.CORS_ORIGIN || '*'
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // =============================================
// // Security & Utility Middleware
// // =============================================
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   crossOriginOpenerPolicy: { policy: "unsafe-none" },
//   contentSecurityPolicy: false,
// }));

// app.use(compression());
// app.use(morgan('combined'));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // =============================================
// // Serverless Database Middleware Connection
// // =============================================
// const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) {
//     return;
//   }
  
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });
//     logger.info('✅ MongoDB connected successfully');
    
//     await createAdminIfNotExists();
    
//     if (process.env.VERCEL !== '1') {
//       scheduleCleanup();
//       logger.info('🧹 Cleanup service started (runs every 5 minutes)');
//     }
//   } catch (error) {
//     logger.error('❌ MongoDB connection error:', error.message);
//     if (process.env.VERCEL !== '1') {
//       process.exit(1);
//     }
//     throw error;
//   }
// };

// // Global interceptor to guarantee DB connectivity on Serverless invocations
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // =============================================
// // Deployment Confirmation & Health Check
// // =============================================

// app.get('/', (req, res) => {
//   return res.status(200).json({
//     success: true,
//     message: '🚀 TradExTV Portal Backend Deployment is Fully Successful!',
//     environment: process.env.VERCEL === '1' ? 'Vercel Serverless Cloud' : 'Local Machine',
//     databaseStatus: 'Connected & Authenticated',
//     timestamp: new Date().toISOString()
//   });
// });

// app.get('/health', (req, res) => {
//   return res.status(200).json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV,
//   });
// });

// // =============================================
// // PUBLIC ROUTES
// // =============================================
// app.use('/api/v1/public', publicRoutes);
// app.use('/api/v1/public/hero', heroRoutes);

// // =============================================
// // API Routes (Protected)
// // =============================================
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/reports', reportRoutes);
// app.use('/api/v1/admin', adminRoutes);                    // ✅ Admin - Reports & Users
// app.use('/api/v1/admin', adminCustomerRoutes);            // ✅ Admin - Customer Management (ADDED)
// app.use('/api/v1/notifications', notificationRoutes);
// app.use('/api/v1/admin/videos', videoRoutes);
// app.use('/api/v1/admin/hero', heroRoutes);
// app.use('/api/v1/news', newsRoutes);
// app.use('/api/v1/blogs', blogRoutes);
// app.use('/api/v1/customer', customerRoutes);

// // =============================================
// // 404 Handler
// // =============================================
// app.use((req, res) => {
//   return res.status(404).json({
//     success: false,
//     error: 'Route not found',
//     path: req.originalUrl,
//   });
// });

// app.use(errorHandler);

// // =============================================
// // Local Development Mode Handler
// // =============================================
// if (process.env.VERCEL !== '1') {
//   connectDB().then(() => {
//     server.listen(PORT, '0.0.0.0', () => {
//       logger.info(`🚀 Local Server running on port ${PORT}`);
//       logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
//     });
//   });

//   const gracefulShutdown = (signal) => {
//     logger.info(`${signal} received, closing server...`);
//     server.close(() => {
//       mongoose.connection.close(false, () => {
//         logger.info('Server closed');
//         process.exit(0);
//       });
//     });
//   };

//   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// }

// export default app;


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';

import authRoutes from './routes/v1/auth.routes.js';
import reportRoutes from './routes/v1/report.routes.js';
import adminRoutes from './routes/v1/admin.routes.js';
import advertisingRoutes from './routes/v1/advertising.routes.js';  // ✅ ADD THIS
import notificationRoutes from './routes/v1/notification.routes.js';
import videoRoutes from './routes/v1/video.routes.js';
import publicRoutes from './routes/v1/public.routes.js';
import heroRoutes from './routes/v1/hero.routes.js';
import newsRoutes from './routes/v1/news.routes.js';
import blogRoutes from './routes/v1/blog.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { createAdminIfNotExists } from './services/authService.js';
import { scheduleCleanup } from './services/cleanupService.js';
import customerRoutes from './routes/v1/customer.routes.js';
import adminCustomerRoutes from './routes/v1/admin-customer.routes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// =============================================
// CORS Configuration
// =============================================
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CORS_ORIGIN || '*'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// =============================================
// Security & Utility Middleware
// =============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  contentSecurityPolicy: false,
}));

app.use(compression());
app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// Serverless Database Middleware Connection
// =============================================
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('✅ MongoDB connected successfully');
    
    await createAdminIfNotExists();
    
    if (process.env.VERCEL !== '1') {
      scheduleCleanup();
      logger.info('🧹 Cleanup service started (runs every 5 minutes)');
    }
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error.message);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

// Global interceptor to guarantee DB connectivity on Serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// =============================================
// Deployment Confirmation & Health Check
// =============================================

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: '🚀 TradExTV Portal Backend Deployment is Fully Successful!',
    environment: process.env.VERCEL === '1' ? 'Vercel Serverless Cloud' : 'Local Machine',
    databaseStatus: 'Connected & Authenticated',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// =============================================
// PUBLIC ROUTES
// =============================================
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/public/hero', heroRoutes);

// =============================================
// API Routes (Protected)
// =============================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);                    // Admin - Reports & Users
app.use('/api/v1/admin', advertisingRoutes);              // ✅ Admin - Advertising Management
app.use('/api/v1/admin', adminCustomerRoutes);            // Admin - Customer Management
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin/videos', videoRoutes);
app.use('/api/v1/admin/hero', heroRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/customer', customerRoutes);

// =============================================
// 404 Handler
// =============================================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

app.use(errorHandler);

// =============================================
// Local Development Mode Handler
// =============================================
if (process.env.VERCEL !== '1') {
  connectDB().then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Local Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  });

  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, closing server...`);
    server.close(() => {
      mongoose.connection.close(false, () => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;

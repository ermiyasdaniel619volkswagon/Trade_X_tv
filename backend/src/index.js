

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
  exposedHeaders: ['RateLimit', 'RateLimit-Policy', 'Retry-After'],
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
    message: '🚀 TRADE X TV Portal Backend Deployment is Fully Successful!',
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
 
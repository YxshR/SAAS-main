import { Router, Request, Response } from 'express';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/middleware/errorHandler';
// Database and Redis will be implemented in shared infrastructure phase
// import { prisma } from '@/utils/database';
// import redisClient from '@/utils/redis';

const router = Router();

// Health check endpoint
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'AI Summarization Backend is running',
    data: {
      service: 'ai-summarization-backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
}));

// Detailed health check with dependencies
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const checks = {
    database: false,
    redis: false,
  };

  // Database and Redis checks will be implemented in shared infrastructure phase
  // For now, mark as not connected since they're not set up yet
  checks.database = false; // Will be true once Prisma is configured
  checks.redis = false; // Will be true once Redis is configured

  const allHealthy = Object.values(checks).every(check => check === true);
  const statusCode = 200; // Return 200 for now since this is expected during setup

  const response: ApiResponse = {
    success: true, // Mark as successful since this is expected during setup phase
    message: 'Backend server operational (database and Redis pending setup)',
    data: {
      service: 'ai-summarization-backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      cpu: process.cpuUsage(),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}));

export default router;
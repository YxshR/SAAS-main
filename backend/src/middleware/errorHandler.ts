import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '@/types';
import { errorLogger } from '@/utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle known operational errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
    isOperational = true;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    isOperational = true;
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    statusCode = 400;
    message = 'Invalid request data';
    isOperational = true;
  }

  // Log error details
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString(),
  };

  if (!isOperational || statusCode >= 500) {
    errorLogger.error('Unhandled error:', errorDetails);
  } else {
    errorLogger.warn('Operational error:', errorDetails);
  }

  // Send error response
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (response as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create operational errors
export const createError = (message: string, statusCode: number): AppError => {
  return new AppError(message, statusCode);
};

// Common error creators
export const badRequest = (message: string = 'Bad Request'): AppError => {
  return new AppError(message, 400);
};

export const unauthorized = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, 401);
};

export const forbidden = (message: string = 'Forbidden'): AppError => {
  return new AppError(message, 403);
};

export const notFound = (message: string = 'Not Found'): AppError => {
  return new AppError(message, 404);
};

export const conflict = (message: string = 'Conflict'): AppError => {
  return new AppError(message, 409);
};

export const tooManyRequests = (message: string = 'Too Many Requests'): AppError => {
  return new AppError(message, 429);
};

export const internalServerError = (message: string = 'Internal Server Error'): AppError => {
  return new AppError(message, 500);
};
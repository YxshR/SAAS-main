import { Request } from 'express';

// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  isPhoneVerified: boolean;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  tokensUsed: number;
  tokensLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionStatus {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Content processing types
export interface ContentSummary {
  id: string;
  userId: string;
  contentType: ContentType;
  contentUrl: string;
  title: string;
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  processingStatus: ProcessingStatus;
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContentType {
  YOUTUBE = 'YOUTUBE',
  ARTICLE = 'ARTICLE'
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Chat types
export interface ChatSession {
  id: string;
  userId: string;
  summaryId: string;
  title: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  createdAt: Date;
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT'
}

export interface Citation {
  text: string;
  source: string;
  timestamp?: number;
  paragraph?: number;
}

// Payment types
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  razorpaySubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY'
}

// Job types
export interface JobData {
  userId: string;
  contentUrl: string;
  contentType: ContentType;
  summaryId: string;
}

export interface JobProgress {
  percentage: number;
  stage: string;
  message: string;
}

// Configuration types
export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  openaiApiKey: string;
  elevenLabsApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  awsS3Bucket: string;
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
}
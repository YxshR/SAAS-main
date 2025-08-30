// User Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  phoneVerified: boolean
  dailyTokens: number
  subscriptionStatus: 'free' | 'premium'
  bio?: string
  location?: string
  website?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Authentication Types
export interface AuthResult {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

// Content Types
export interface ProcessedContent {
  id: string
  type: 'youtube' | 'article'
  title: string
  content: string
  metadata: ContentMetadata
  timestamps?: Timestamp[]
}

export interface ContentMetadata {
  url: string
  duration?: number
  author?: string
  publishedAt?: string
  thumbnailUrl?: string
}

export interface Timestamp {
  time: number
  text: string
}

// Summary Types
export interface SummaryResult {
  id: string
  shortSummary: string
  detailedSummary: string
  keyPoints: string[]
  timestamps?: TimestampedPoint[]
  createdAt: string
}

export interface TimestampedPoint {
  point: string
  timestamp: number
}

// Chat Types
export interface ChatSession {
  id: string
  summaryId: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  createdAt: string
}

export interface Citation {
  source: string
  timestamp?: number
  paragraph?: number
}

export interface ChatResponse {
  message: string
  citations: Citation[]
  confidence: number
  timestamp: string
}

// Audio Types
export interface AudioResult {
  audioId: string
  duration: number
  fileSize: number
  streamUrl: string
}

// Payment Types
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  monthlyRequestLimit: number
  requestsUsed: number
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  requestLimit: number
  features: string[]
  popular?: boolean
}

export interface Payment {
  id: string
  userId: string
  subscriptionId?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'stripe'
  paymentId: string
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  clientSecret?: string
  razorpayOrderId?: string
}

export interface CreditPurchase {
  id: string
  userId: string
  credits: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  paymentId: string
  createdAt: string
}

export interface UsageStats {
  currentPeriodStart: string
  currentPeriodEnd: string
  requestsUsed: number
  requestsLimit: number
  dailyTokensUsed: number
  dailyTokensLimit: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
    timestamp: string
    requestId: string
  }
}
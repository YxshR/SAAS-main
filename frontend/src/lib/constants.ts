// API Configuration
export const API_CONFIG = {
  NODEJS_BASE_URL: process.env.NEXT_PUBLIC_NODEJS_API_URL || 'http://localhost:8000',
  RUST_BASE_URL: process.env.NEXT_PUBLIC_RUST_API_URL || 'http://localhost:8001',
  PREFERRED_BACKEND: process.env.NEXT_PUBLIC_BACKEND_TYPE || 'nodejs',
} as const

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'AI Summarizer',
  APP_DESCRIPTION: 'AI-powered YouTube and web article summarization platform',
  FREE_DAILY_TOKENS: 5,
  PREMIUM_MONTHLY_REQUESTS: 100,
  PREMIUM_PRICE: 99, // in INR
} as const

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our service',
    price: 0,
    currency: 'INR',
    interval: 'month' as const,
    requestLimit: 5,
    features: [
      '5 daily tokens',
      'Basic summaries',
      'Chat with content',
      'Text-to-speech',
      'Phone verification required after free tokens'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For regular users who need more summaries',
    price: 99,
    currency: 'INR',
    interval: 'month' as const,
    requestLimit: 100,
    features: [
      '100 monthly requests',
      'All summary types',
      'Unlimited chat',
      'High-quality TTS',
      'Priority support',
      'Export summaries'
    ],
    popular: true
  }
] as const

// Credit Packages
export const CREDIT_PACKAGES = [
  {
    id: 'credits_10',
    name: '10 Credits',
    credits: 10,
    price: 49,
    currency: 'INR',
    popular: false
  },
  {
    id: 'credits_25',
    name: '25 Credits',
    credits: 25,
    price: 99,
    currency: 'INR',
    popular: true,
    savings: 25
  },
  {
    id: 'credits_50',
    name: '50 Credits',
    credits: 50,
    price: 179,
    currency: 'INR',
    popular: false,
    savings: 40
  }
] as const

// Content Limits
export const CONTENT_LIMITS = {
  YOUTUBE_MAX_DURATION: 4 * 60 * 60, // 4 hours in seconds
  ARTICLE_MAX_CHARS: 50000,
  SUMMARY_TYPES: ['short', 'detailed', 'keyPoints'] as const,
} as const

// Rate Limits
export const RATE_LIMITS = {
  JOBS_PER_HOUR: 10,
  OTP_COOLDOWN: 60, // seconds
  MAX_OTP_ATTEMPTS: 3,
} as const
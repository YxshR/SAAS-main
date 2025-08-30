import { AppConfig } from '@/types';

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (name: string, defaultValue?: number): number => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

const getEnvBoolean = (name: string, defaultValue?: boolean): boolean => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value ? value.toLowerCase() === 'true' : defaultValue!;
};

export const config: AppConfig = {
  // Server Configuration
  port: getEnvNumber('PORT', 8000),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  apiVersion: getEnvVar('API_VERSION', 'v1'),

  // Database Configuration
  databaseUrl: getEnvVar('DATABASE_URL'),
  redisUrl: getEnvVar('REDIS_URL', 'redis://localhost:6379'),

  // JWT Configuration
  jwtSecret: getEnvVar('JWT_SECRET'),
  jwtRefreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
  jwtRefreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),

  // OpenAI Configuration
  openaiApiKey: getEnvVar('OPENAI_API_KEY'),

  // ElevenLabs Configuration
  elevenLabsApiKey: getEnvVar('ELEVENLABS_API_KEY'),

  // Twilio Configuration
  twilioAccountSid: getEnvVar('TWILIO_ACCOUNT_SID'),
  twilioAuthToken: getEnvVar('TWILIO_AUTH_TOKEN'),
  twilioPhoneNumber: getEnvVar('TWILIO_PHONE_NUMBER'),

  // Payment Gateway Configuration
  stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  razorpayKeyId: getEnvVar('RAZORPAY_KEY_ID'),
  razorpayKeySecret: getEnvVar('RAZORPAY_KEY_SECRET'),

  // File Storage Configuration
  awsAccessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
  awsSecretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
  awsRegion: getEnvVar('AWS_REGION', 'us-east-1'),
  awsS3Bucket: getEnvVar('AWS_S3_BUCKET'),

  // Security Configuration
  bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
  rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
  rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),

  // Logging Configuration
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
};

export default config;
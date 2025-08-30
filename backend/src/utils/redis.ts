import { createClient, RedisClientType } from 'redis';
import logger from './logger';

class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 50, 1000);
        },
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('✅ Redis client connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('✅ Redis client ready');
    });

    this.client.on('error', (error) => {
      logger.error('❌ Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client connection ended');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.client.connect();
      }
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.disconnect();
      }
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  // Session management
  async setSession(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    try {
      await this.client.setEx(`session:${key}`, ttlSeconds, value);
    } catch (error) {
      logger.error('Failed to set session:', error);
      throw error;
    }
  }

  async getSession(key: string): Promise<string | null> {
    try {
      return await this.client.get(`session:${key}`);
    } catch (error) {
      logger.error('Failed to get session:', error);
      throw error;
    }
  }

  async deleteSession(key: string): Promise<void> {
    try {
      await this.client.del(`session:${key}`);
    } catch (error) {
      logger.error('Failed to delete session:', error);
      throw error;
    }
  }

  // Cache management
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error('Failed to set cache:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Failed to get cache:', error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Failed to delete cache:', error);
      throw error;
    }
  }

  // OTP management
  async setOTP(phone: string, otp: string, ttlSeconds: number = 300): Promise<void> {
    try {
      await this.client.setEx(`otp:${phone}`, ttlSeconds, otp);
    } catch (error) {
      logger.error('Failed to set OTP:', error);
      throw error;
    }
  }

  async getOTP(phone: string): Promise<string | null> {
    try {
      return await this.client.get(`otp:${phone}`);
    } catch (error) {
      logger.error('Failed to get OTP:', error);
      throw error;
    }
  }

  async deleteOTP(phone: string): Promise<void> {
    try {
      await this.client.del(`otp:${phone}`);
    } catch (error) {
      logger.error('Failed to delete OTP:', error);
      throw error;
    }
  }

  // Rate limiting
  async incrementRateLimit(key: string, windowMs: number): Promise<number> {
    try {
      const current = await this.client.incr(`rate_limit:${key}`);
      if (current === 1) {
        await this.client.expire(`rate_limit:${key}`, Math.ceil(windowMs / 1000));
      }
      return current;
    } catch (error) {
      logger.error('Failed to increment rate limit:', error);
      throw error;
    }
  }

  async getRateLimit(key: string): Promise<number> {
    try {
      const count = await this.client.get(`rate_limit:${key}`);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      logger.error('Failed to get rate limit:', error);
      throw error;
    }
  }

  // Health check
  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch (error) {
      logger.error('Redis ping failed:', error);
      throw error;
    }
  }

  // Get client for advanced operations
  getClient(): RedisClientType {
    return this.client;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
const redisClient = new RedisClient();

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
};

export const disconnectRedis = async (): Promise<void> => {
  await redisClient.disconnect();
};

export { redisClient };
export default redisClient;
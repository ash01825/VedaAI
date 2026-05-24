import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    logger.info('[DB] Already connected to MongoDB');
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info('[DB] ✅ Connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      logger.error('[DB] MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('[DB] MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('[DB] MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    logger.error('[DB] Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('[DB] Disconnected from MongoDB');
}

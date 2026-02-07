import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
}

import { CachedResponse } from '../models/CachedResponse.js';

export async function get(key: string): Promise<any | null> {
  try {
    const cached = await CachedResponse.findOne({ key });
    return cached ? cached.data : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function set(key: string, type: string, data: any): Promise<void> {
  try {
    await CachedResponse.findOneAndUpdate(
      { key },
      {
        key,
        type,
        data,
        createdAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );
  } catch (error) {
    console.error('Cache set error:', error);
    // Don't throw - caching is non-critical
  }
}

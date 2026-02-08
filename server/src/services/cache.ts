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

export async function getAllConcepts(): Promise<string[]> {
  try {
    const docs = await CachedResponse.find({
      type: { $in: ['scout', 'hover'] }
    }).select('key type data');

    const allTopics = new Set<string>();
    const childTopics = new Set<string>();

    docs.forEach(doc => {
      // Extract topic from key
      const separatorIndex = doc.key.indexOf(':');
      if (separatorIndex !== -1) {
        const topic = doc.key.substring(separatorIndex + 1).toLowerCase().trim();
        allTopics.add(topic);

        // If scout, check its subtopics
        if (doc.type === 'scout' && doc.data && Array.isArray(doc.data.subTopics)) {
          doc.data.subTopics.forEach((sub: any) => {
            if (sub && sub.label) {
              childTopics.add(sub.label.toLowerCase().trim());
            }
          });
        }
      }
    });

    // Roots are topics that are NOT in childTopics
    const rootTopics = Array.from(allTopics).filter(topic => !childTopics.has(topic));

    // Allow user to see roots. Capitalize.
    return rootTopics.map(t =>
      t.charAt(0).toUpperCase() + t.slice(1)
    ).sort();
  } catch (error) {
    console.error('Cache getAllConcepts error:', error);
    return [];
  }
}

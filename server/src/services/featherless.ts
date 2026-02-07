import OpenAI from 'openai';
import { config } from '../config/env.js';

const client = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: config.featherlessApiKey
});

const SYSTEM_PROMPT = `You are a knowledge exploration assistant. Given a topic, generate exactly 4 interesting and educational sub-topics. Return ONLY a JSON array of 4 strings, nothing else. Each sub-topic should be concise (2-5 words).`;

export async function generateSubTopics(parentTopic: string): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen3-32B',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parent topic: ${parentTopic}` }
      ],
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Featherless API');
    }

    // Parse JSON array
    const subTopics = JSON.parse(content);

    // Validate it's an array with exactly 4 items
    if (!Array.isArray(subTopics) || subTopics.length !== 4) {
      console.warn('Featherless returned invalid format, using fallback');
      return [];
    }

    return subTopics.map(topic => String(topic));
  } catch (error: any) {
    if (error.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    console.error('Featherless error:', error);
    throw new Error('Failed to generate sub-topics');
  }
}

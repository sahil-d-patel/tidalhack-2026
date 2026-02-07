import { Request, Response } from 'express';
import { generateFunFact } from '../services/gemini.js';
import * as cacheService from '../services/cache.js';
import type { HoverResponse } from '../types/index.js';

export async function getFunFact(req: Request, res: Response): Promise<void> {
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    res.status(400).json({
      error: 'Missing or invalid topic parameter'
    });
    return;
  }

  const cacheKey = `hover:${topic.toLowerCase().trim()}`;

  // Check cache first
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    res.json({
      data: cached,
      source: 'cache'
    });
    return;
  }

  // Generate new fun fact
  const funFact = await generateFunFact(topic);

  const responseData: HoverResponse = { funFact };

  // Cache the result
  await cacheService.set(cacheKey, 'hover', responseData);

  res.json({
    data: responseData,
    source: 'api'
  });
}

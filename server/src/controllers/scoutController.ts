import { Request, Response } from 'express';
import { generateSubTopics } from '../services/featherless.js';
import { generateQuiz } from '../services/gemini.js';
import * as cacheService from '../services/cache.js';
import type { SubTopic, ScoutResponse } from '../types/index.js';

export async function expandNode(req: Request, res: Response): Promise<void> {
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    res.status(400).json({
      error: 'Missing or invalid topic parameter'
    });
    return;
  }

  const cacheKey = `scout:${topic.toLowerCase().trim()}`;

  // Check cache first
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    res.json({
      data: cached,
      source: 'cache'
    });
    return;
  }

  // Generate new response
  const subTopicLabels = await generateSubTopics(topic);

  // Generate quiz for each sub-topic in parallel
  const quizPromises = subTopicLabels.map(label => generateQuiz(label));
  const quizzes = await Promise.all(quizPromises);

  // Build SubTopic array
  const subTopics: SubTopic[] = subTopicLabels.map((label, index) => ({
    label,
    quiz: quizzes[index]
  }));

  const responseData: ScoutResponse = { subTopics };

  // Cache the result
  await cacheService.set(cacheKey, 'scout', responseData);

  res.json({
    data: responseData,
    source: 'api'
  });
}

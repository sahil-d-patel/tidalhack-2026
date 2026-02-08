import { Request, Response } from 'express';
import { generateSubTopicsWithFacts as generateFeatherless } from '../services/featherless.js';
import { generateSubTopicsWithFacts as generateGemini } from '../services/gemini.js';
import { config } from '../config/env.js';
import * as cacheService from '../services/cache.js';
import type { SubTopic, ScoutResponse } from '../types/index.js';

// Logging helper
function log(emoji: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

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

  try {
    // Generate sub-topics AND fun facts in a single call
    const generate = config.useGemini ? generateGemini : generateFeatherless;
    const results = await generate(topic);

    // Map to SubTopic format
    const subTopics: SubTopic[] = results.map((item) => ({
      label: item.label,
      funFact: item.funFact,
      quiz: null  // Quizzes are generated in mastery quiz later
    }));

    if (subTopics.length === 0) {
      throw new Error('No sub-topics generated');
    }

    log('✅', `Successfully processed ${subTopics.length} sub-topics with facts`);

    const responseData: ScoutResponse = { subTopics };

    // Cache the result
    await cacheService.set(cacheKey, 'scout', responseData);

    res.json({
      data: responseData,
      source: 'api'
    });
  } catch (error: any) {
    log('❌', `Error expanding node: ${error.message}`);
    res.status(500).json({
      error: 'Failed to expand node',
      message: error.message || 'Unknown error'
    });
  }
}
// Build full tree from cache recursively
async function buildTreeFromCache(topic: string, visited = new Set<string>()): Promise<any> {
  const normalizedTopic = topic.toLowerCase().trim();

  // Prevent infinite loops
  if (visited.has(normalizedTopic)) {
    return { label: topic, funFact: '', quiz: null, children: [] };
  }
  visited.add(normalizedTopic);

  const cacheKey = `scout:${normalizedTopic}`;
  const cached = await cacheService.get(cacheKey);

  if (!cached || !cached.subTopics || !Array.isArray(cached.subTopics)) {
    return { label: topic, funFact: '', quiz: null, children: [] };
  }

  const children = await Promise.all(
    cached.subTopics.map(async (sub: SubTopic) => {
      const childTree = await buildTreeFromCache(sub.label, visited);
      return {
        label: sub.label,
        funFact: sub.funFact,
        quiz: sub.quiz,
        children: childTree.children,
      };
    })
  );

  return { label: topic, funFact: '', quiz: null, children };
}

// Get full previously-explored tree for a topic
export async function getTree(req: Request, res: Response): Promise<void> {
  const { topic } = req.params;

  if (!topic || typeof topic !== 'string') {
    res.status(400).json({ error: 'Missing or invalid topic parameter' });
    return;
  }

  try {
    // Get root fun fact
    const hoverKey = `hover:${topic.toLowerCase().trim()}`;
    const hoverCached = await cacheService.get(hoverKey);
    const funFact = hoverCached?.funFact || '';

    const tree = await buildTreeFromCache(topic);
    tree.funFact = funFact;

    log('🌳', `Built tree for "${topic}" with ${JSON.stringify(tree.children.length)} direct children`);

    res.json({ data: tree });
  } catch (error: any) {
    log('❌', `Error building tree: ${error.message}`);
    res.status(500).json({ error: 'Failed to build tree', message: error.message });
  }
}

// Retrieve all known concepts from DB
export async function getConcepts(req: Request, res: Response): Promise<void> {
  try {
    const concepts = await cacheService.getAllConcepts();
    res.json({
      data: { concepts },
      source: 'db'
    });
  } catch (error: any) {
    log('❌', `Error fetching concepts: ${error.message}`);
    res.status(500).json({
      error: 'Failed to fetch concepts',
      message: error.message
    });
  }
}



import OpenAI from 'openai';
import { config } from '../config/env.js';
import type { QuizData } from '../types/index.js';

const client = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: config.featherlessApiKey
});

const MODEL = config.featherlessModel;

const SUBTOPICS_SYSTEM_PROMPT = `You are a knowledge exploration assistant. Given a topic, generate exactly 4 interesting and educational sub-topics. Return ONLY a JSON array of 4 strings, nothing else. Each sub-topic should be concise (2-5 words).`;

const FUN_FACT_SYSTEM_PROMPT = `You are a fun facts assistant. Share one fascinating, concise fun fact about the given topic in 1-2 sentences. Make it surprising and educational. Return ONLY the fun fact text, nothing else.`;

const QUIZ_SYSTEM_PROMPT = `You are a quiz generator. Create a multiple-choice quiz question about the given topic. Return ONLY valid JSON with this exact structure: {"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0}. The question should be educational and engaging.`;

// Helper to strip thinking tags from reasoning models
function stripThinkingTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

export async function generateSubTopics(parentTopic: string): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SUBTOPICS_SYSTEM_PROMPT },
        { role: 'user', content: `Parent topic: ${parentTopic}` }
      ],
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Featherless API');
    }

    const cleanedContent = stripThinkingTags(content);

    // Extract JSON array from the response
    const jsonMatch = cleanedContent.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      console.warn('No JSON array found in Featherless response:', content);
      return [];
    }

    const subTopics = JSON.parse(jsonMatch[0]);

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

export async function generateFunFact(topic: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: FUN_FACT_SYSTEM_PROMPT },
        { role: 'user', content: `Topic: ${topic}` }
      ],
      temperature: 0.8
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Featherless API');
    }

    const cleanedContent = stripThinkingTags(content);
    return cleanedContent;
  } catch (error: any) {
    console.error('Featherless fun fact error:', error);
    throw new Error('Failed to generate fun fact');
  }
}

export async function generateQuiz(topic: string): Promise<QuizData | null> {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: `Topic: ${topic}` }
      ],
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      console.warn('Empty response from Featherless quiz API');
      return null;
    }

    const cleanedContent = stripThinkingTags(content);

    // Extract JSON from response
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in Featherless quiz response');
      return null;
    }

    const quizData = JSON.parse(jsonMatch[0]) as QuizData;

    // Validate structure
    if (
      !quizData.question ||
      !Array.isArray(quizData.options) ||
      quizData.options.length !== 4 ||
      typeof quizData.correctIndex !== 'number' ||
      quizData.correctIndex < 0 ||
      quizData.correctIndex > 3
    ) {
      console.warn('Invalid quiz structure from Featherless');
      return null;
    }

    return quizData;
  } catch (error: any) {
    console.error('Featherless quiz error:', error);
    return null;
  }
}


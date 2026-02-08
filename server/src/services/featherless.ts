import OpenAI from 'openai';
import { config } from '../config/env.js';
import type { QuizData } from '../types/index.js';

const client = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: config.featherlessApiKey
});

const MODEL = config.featherlessModel;

const SUBTOPICS_SYSTEM_PROMPT = `You are a knowledge exploration assistant. Given a topic, generate exactly 4 interesting and educational sub-topics. Return ONLY a JSON array of 4 strings, nothing else. Each sub-topic should be concise (2-5 words).`;

const SUBTOPICS_WITH_FACTS_SYSTEM_PROMPT = `You are a knowledge exploration assistant. Given a topic, generate exactly 4 interesting and educational sub-topics.
For each sub-topic, also provide a fun fact (1-2 sentences).
Return ONLY a valid JSON array of objects with this structure:
[
  { "label": "Subtopic Name", "funFact": "Interesting fact about this subtopic..." },
  ...
]
Do not include any other text.`;

const FUN_FACT_SYSTEM_PROMPT = `You are a fun facts assistant. Share one fascinating, concise fun fact about the given topic in 1-2 sentences. Make it surprising and educational. Return ONLY the fun fact text, nothing else.`;

const QUIZ_SYSTEM_PROMPT = `You are a quiz generator. Create a multiple-choice quiz question about the given topic. Return ONLY valid JSON with this exact structure: {"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0}. The question should be educational and engaging.`;

// Helper to strip thinking tags from reasoning models
function stripThinkingTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

// Logging helper for consistent output
function log(emoji: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

export type SubTopicWithFact = {
  label: string;
  funFact: string;
}

export async function generateSubTopics(parentTopic: string): Promise<string[]> {
  const startTime = Date.now();
  log('🌳', `Generating sub-topics for: "${parentTopic}"`);
  log('🤖', `Using model: ${MODEL}`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SUBTOPICS_SYSTEM_PROMPT },
        { role: 'user', content: `Parent topic: ${parentTopic}` }
      ],
      temperature: 0.7
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      log('❌', `Empty response from LLM (${elapsed}s)`);
      throw new Error('Empty response from Featherless API');
    }

    const cleanedContent = stripThinkingTags(content);

    // Extract JSON array from the response
    const jsonMatch = cleanedContent.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      log('⚠️', `No JSON array found in response (${elapsed}s)`);
      console.warn('Raw content:', content);
      return [];
    }

    const subTopics = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(subTopics) || subTopics.length !== 4) {
      log('⚠️', `Invalid format - expected 4 topics, got ${subTopics.length} (${elapsed}s)`);
      return [];
    }

    log('✅', `Generated ${subTopics.length} sub-topics in ${elapsed}s`);
    subTopics.forEach((topic: string, i: number) => {
      log('   ', `${i + 1}. ${topic}`);
    });

    return subTopics.map(topic => String(topic));
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    if (error.status === 429) {
      log('🚫', `Rate limit exceeded (${elapsed}s)`);
      throw new Error('Rate limit exceeded');
    }
    log('❌', `Error generating sub-topics (${elapsed}s): ${error.message}`);
    throw new Error('Failed to generate sub-topics');
  }
}

export async function generateSubTopicsWithFacts(parentTopic: string): Promise<SubTopicWithFact[]> {
  const startTime = Date.now();
  log('🌟', `Generating sub-topics with facts for: "${parentTopic}"`);
  log('🤖', `Using model: ${MODEL}`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SUBTOPICS_WITH_FACTS_SYSTEM_PROMPT },
        { role: 'user', content: `Parent topic: ${parentTopic}` }
      ],
      temperature: 0.7
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      log('❌', `Empty response from LLM (${elapsed}s)`);
      throw new Error('Empty response from Featherless API');
    }

    let cleanedContent = stripThinkingTags(content);

    // Remove markdown code blocks if present
    cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    // Extract JSON array from the response if it's wrapped in text
    const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    } else {
      // If no array brackets found, it might be just text, check if it starts with [
      const firstBracket = cleanedContent.indexOf('[');
      const lastBracket = cleanedContent.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanedContent = cleanedContent.substring(firstBracket, lastBracket + 1);
      }
    }

    let subTopics: SubTopicWithFact[];
    try {
      subTopics = JSON.parse(cleanedContent) as SubTopicWithFact[];
    } catch (parseError) {
      log('⚠️', `JSON Parse Error: ${parseError} (${elapsed}s)`);
      console.warn('Raw content:', content);
      return [];
    }

    if (!Array.isArray(subTopics) || subTopics.length === 0) {
      log('⚠️', `Invalid format - expected array of objects, got ${Array.isArray(subTopics) ? subTopics.length : 'not array'} (${elapsed}s)`);
      return [];
    }

    // Validate structure
    const validSubTopics = subTopics.filter(t => t.label && t.funFact);
    if (validSubTopics.length !== subTopics.length) {
      log('⚠️', `Some topics missing fields. Got ${validSubTopics.length} valid topics.`);
    }

    log('✅', `Generated ${validSubTopics.length} sub-topics with facts in ${elapsed}s`);
    validSubTopics.forEach((topic, i) => {
      log('   ', `${i + 1}. ${topic.label}`);
    });

    return validSubTopics.slice(0, 4); // Ensure we return at most 4
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    if (error.status === 429) {
      log('🚫', `Rate limit exceeded (${elapsed}s)`);
      throw new Error('Rate limit exceeded');
    }
    log('❌', `Error generating sub-topics with facts (${elapsed}s): ${error.message}`);
    throw new Error('Failed to generate sub-topics with facts');
  }
}

export async function generateFunFact(topic: string): Promise<string> {
  const startTime = Date.now();
  log('💡', `Generating fun fact for: "${topic}"`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: FUN_FACT_SYSTEM_PROMPT },
        { role: 'user', content: `Topic: ${topic}` }
      ],
      temperature: 0.8
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      log('❌', `Empty response from LLM (${elapsed}s)`);
      throw new Error('Empty response from Featherless API');
    }

    const cleanedContent = stripThinkingTags(content);
    log('✅', `Generated fun fact in ${elapsed}s`);
    log('   ', `"${cleanedContent.substring(0, 80)}${cleanedContent.length > 80 ? '...' : ''}"`);

    return cleanedContent;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `Error generating fun fact (${elapsed}s): ${error.message}`);
    throw new Error('Failed to generate fun fact');
  }
}

const MASTERY_QUIZ_SYSTEM_PROMPT = `You are a quiz master. Create a mastery quiz based on the provided list of topics.
Generate exactly 5 multiple choice questions:
1. One general question about the main topic.
2. One question for each of the 4 sub-topics (if provided).

Return ONLY a valid, raw JSON array of objects with this exact structure:
[
  { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0-3 },
  ...
]
IMPORTANT: Do NOT use markdown code blocks (like \`\`\`json). Return the raw JSON string only. Ensure all strings are properly escaped.`;

export async function generateMasteryQuiz(parentTopic: string, subTopics: string[]): Promise<QuizData[]> {
  const startTime = Date.now();
  log('🎓', `Generating mastery quiz set for: "${parentTopic}" + ${subTopics.length} sub-topics`);
  log('🤖', `Using model: ${MODEL}`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: MASTERY_QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: `Main Topic: ${parentTopic}\nSub-topics: ${subTopics.join(', ')}` }
      ],
      temperature: 0.7
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      log('❌', `Empty response from LLM (${elapsed}s)`);
      throw new Error('Empty response from Featherless API');
    }

    let cleanedContent = stripThinkingTags(content);

    // Remove markdown code blocks if present
    cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    // Extract JSON array from the response if it's wrapped in text
    const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    } else {
      // If no array brackets found, it might be just text, check if it starts with [
      const firstBracket = cleanedContent.indexOf('[');
      const lastBracket = cleanedContent.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanedContent = cleanedContent.substring(firstBracket, lastBracket + 1);
      }
    }

    let quizSet: any;
    try {
      quizSet = JSON.parse(cleanedContent);
    } catch (parseError) {
      log('⚠️', `JSON Parse Error: ${parseError} (${elapsed}s)`);
      console.warn('Raw content:', content);
      console.warn('Cleaned content:', cleanedContent);
      return [];
    }

    if (!Array.isArray(quizSet)) {
      log('⚠️', `Invalid format - expected array, got ${typeof quizSet} (${elapsed}s)`);
      return [];
    }

    const validQuizzes = quizSet.filter((q: any) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === 'number'
    );

    log('✅', `Generated ${validQuizzes.length} valid quiz questions in ${elapsed}s`);

    return validQuizzes;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `Error generating mastery quiz (${elapsed}s): ${error.message}`);
    return [];
  }
}

export async function generateQuiz(topic: string): Promise<QuizData | null> {
  const startTime = Date.now();
  log('🎯', `Generating quiz for: "${topic}"`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: `Topic: ${topic}` }
      ],
      temperature: 0.7
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      log('⚠️', `Empty quiz response (${elapsed}s)`);
      return null;
    }

    const cleanedContent = stripThinkingTags(content);

    // Extract JSON from response
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      log('⚠️', `No JSON found in quiz response (${elapsed}s)`);
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
      log('⚠️', `Invalid quiz structure (${elapsed}s)`);
      return null;
    }

    log('✅', `Generated quiz in ${elapsed}s`);
    log('   ', `Q: "${quizData.question.substring(0, 60)}${quizData.question.length > 60 ? '...' : ''}"`);

    return quizData;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `Error generating quiz (${elapsed}s): ${error.message}`);
    return null;
  }
}



import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import type { QuizData, SubTopicWithFact } from '../types/index.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const GEMINI_MODEL = 'gemini-2.5-flash';

// Logging helper for consistent output
function log(emoji: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

export async function generateFunFact(topic: string): Promise<string> {
  const startTime = Date.now();
  log('💡', `[Gemini] Generating fun fact for: "${topic}"`);
  log('🤖', `[Gemini] Using model: ${GEMINI_MODEL}`);

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Share one fascinating, concise fun fact about '${topic}' in 1-2 sentences. Make it surprising and educational. If possible, add a winter or nature metaphor.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('✅', `[Gemini] Generated fun fact in ${elapsed}s`);
    log('   ', `"${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);

    return text;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `[Gemini] Error generating fun fact (${elapsed}s): ${error.message}`);
    throw new Error('Failed to generate fun fact');
  }
}

export async function generateSubTopicsWithFacts(parentTopic: string): Promise<SubTopicWithFact[]> {
  const startTime = Date.now();
  log('🌟', `[Gemini] Generating sub-topics with facts for: "${parentTopic}"`);
  log('🤖', `[Gemini] Using model: ${GEMINI_MODEL}`);

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `You are a knowledge exploration assistant. Given a topic, generate exactly 4 interesting and educational sub-topics.
For each sub-topic, also provide a fun fact (1-2 sentences).

Return ONLY a valid, raw JSON array of objects with this structure:
[
  { "label": "Subtopic Name", "funFact": "Interesting fact about this subtopic..." },
  ...
]
IMPORTANT: Do NOT use markdown code blocks. Return the raw JSON string only.`;

    const result = await model.generateContent(prompt + `\n\nParent topic: ${parentTopic}`);
    const response = result.response;
    const text = response.text();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Clean up response
    let cleanedContent = text.trim();
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
      log('⚠️', `[Gemini] JSON Parse Error: ${parseError} (${elapsed}s)`);
      console.warn('Raw content:', text);
      return [];
    }

    if (!Array.isArray(subTopics) || subTopics.length === 0) {
      log('⚠️', `[Gemini] Invalid format - expected array of objects, got ${Array.isArray(subTopics) ? subTopics.length : 'not array'} (${elapsed}s)`);
      return [];
    }

    // Validate structure
    const validSubTopics = subTopics.filter(t => t.label && t.funFact);
    if (validSubTopics.length !== subTopics.length) {
      log('⚠️', `[Gemini] Some topics missing fields. Got ${validSubTopics.length} valid topics.`);
    }

    log('✅', `[Gemini] Generated ${validSubTopics.length} sub-topics with facts in ${elapsed}s`);
    validSubTopics.forEach((topic, i) => {
      log('   ', `${i + 1}. ${topic.label}`);
    });

    return validSubTopics.slice(0, 4); // Ensure we return at most 4
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `[Gemini] Error generating sub-topics with facts (${elapsed}s): ${error.message}`);
    throw new Error('Failed to generate sub-topics with facts');
  }
}

export async function generateMasteryQuiz(parentTopic: string, subTopics: string[]): Promise<QuizData[]> {
  const startTime = Date.now();
  log('🎓', `[Gemini] Generating mastery quiz for: "${parentTopic}" + ${subTopics.length} sub-topics`);
  log('🤖', `[Gemini] Using model: ${GEMINI_MODEL}`);

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `You are a quiz master. Create a mastery quiz based on the provided list of topics.
Main Topic: ${parentTopic}
Sub-topics: ${subTopics.join(', ')}

Generate exactly 5 multiple choice questions:
1. One general question about the main topic.
2. One question for each of the 4 sub-topics.

Return ONLY a valid, raw JSON array of objects with this exact structure:
[
  { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0-3 },
  ...
]
IMPORTANT: Do NOT use markdown code blocks. Return the raw JSON string only.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Clean up response
    let cleanedContent = text.trim();
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
      log('⚠️', `[Gemini] JSON Parse Error: ${parseError} (${elapsed}s)`);
      console.warn('Raw content:', text);
      return [];
    }

    if (!Array.isArray(quizSet)) {
      log('⚠️', `[Gemini] Invalid format - expected array, got ${typeof quizSet} (${elapsed}s)`);
      return [];
    }

    const validQuizzes = quizSet.filter((q: any) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === 'number'
    );

    log('✅', `[Gemini] Generated ${validQuizzes.length} valid quiz questions in ${elapsed}s`);

    return validQuizzes;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `[Gemini] Error generating mastery quiz (${elapsed}s): ${error.message}`);
    return [];
  }
}

export async function generateQuiz(topic: string): Promise<QuizData | null> {
  const startTime = Date.now();
  log('🎯', `[Gemini] Generating quiz for: "${topic}"`);

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Create a multiple-choice quiz question about '${topic}'. Return ONLY valid JSON with this exact structure: {"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0}. The question should be educational and engaging. Include a winter metaphor if natural.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Extract JSON from potential markdown wrapping
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      log('⚠️', `[Gemini] No JSON found in quiz response (${elapsed}s)`);
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
      log('⚠️', `[Gemini] Invalid quiz structure (${elapsed}s)`);
      return null;
    }

    log('✅', `[Gemini] Generated quiz in ${elapsed}s`);
    log('   ', `Q: "${quizData.question.substring(0, 60)}${quizData.question.length > 60 ? '...' : ''}"`);

    return quizData;
  } catch (error: any) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log('❌', `[Gemini] Error generating quiz (${elapsed}s): ${error.message}`);
    return null; // Graceful degradation
  }
}


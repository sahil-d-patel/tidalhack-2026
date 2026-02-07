import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import type { QuizData } from '../types/index.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export async function generateFunFact(topic: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Share one fascinating, concise fun fact about '${topic}' in 1-2 sentences. Make it surprising and educational. If possible, add a winter or nature metaphor.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error: any) {
    console.error('Gemini fun fact error:', error);
    throw new Error('Failed to generate fun fact');
  }
}

export async function generateQuiz(topic: string): Promise<QuizData | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Create a multiple-choice quiz question about '${topic}'. Return ONLY valid JSON with this exact structure: {"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0}. The question should be educational and engaging. Include a winter metaphor if natural.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from potential markdown wrapping
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in Gemini quiz response');
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
      console.warn('Invalid quiz structure from Gemini');
      return null;
    }

    return quizData;
  } catch (error: any) {
    console.error('Gemini quiz error:', error);
    return null; // Graceful degradation
  }
}

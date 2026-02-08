import { Request, Response } from 'express';
import { generateMasteryQuiz as generateMasteryQuizFeatherless } from '../services/featherless.js';
import { generateMasteryQuiz as generateMasteryQuizGemini } from '../services/gemini.js';
import * as cacheService from '../services/cache.js';
import { Quiz } from '../models/Quiz.js';
import { config } from '../config/env.js';
import type { QuizData } from '../types/index.js';

// Logging helper
function log(emoji: string, message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${emoji} ${message}`);
}

export async function getMasteryQuiz(req: Request, res: Response): Promise<void> {
    const { topic, childTopics, rootTopic } = req.body;

    if (!topic || typeof topic !== 'string') {
        res.status(400).json({
            error: 'Missing or invalid topic parameter'
        });
        return;
    }

    if (!childTopics || !Array.isArray(childTopics) || childTopics.length === 0) {
        res.status(400).json({
            error: 'Missing or invalid childTopics array'
        });
        return;
    }

    // Root topic defaults to topic if not provided
    const effectiveRootTopic = rootTopic || topic;

    const cacheKey = `mastery:${topic.toLowerCase().trim()}:${childTopics.sort().join(',')}`;

    // Check cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        res.json({
            data: cached,
            source: 'cache'
        });
        return;
    }

    // Check if quiz exists in database
    try {
        const existingQuiz = await Quiz.findOne({
            rootTopic: effectiveRootTopic.toLowerCase().trim(),
            parentTopic: topic.toLowerCase().trim()
        });

        if (existingQuiz && existingQuiz.questions.length > 0) {
            log('📖', `Found existing quiz in database for: "${topic}"`);

            const responseData = {
                topic,
                quizzes: existingQuiz.questions,
                totalQuestions: existingQuiz.questions.length
            };

            // Also cache it
            await cacheService.set(cacheKey, 'mastery', responseData);

            res.json({
                data: responseData,
                source: 'database'
            });
            return;
        }
    } catch (dbError: any) {
        log('⚠️', `Database lookup failed: ${dbError.message}`);
        // Continue to generate new quiz
    }

    log('🎓', `Generating mastery quiz for: "${topic}"`);
    log('📚', `Child topics: ${childTopics.join(', ')}`);

    try {
        const generateMastery = config.useGemini ? generateMasteryQuizGemini : generateMasteryQuizFeatherless;

        // Generate entire quiz set in one call
        const validQuizzes = await generateMastery(topic, childTopics.slice(0, 4));

        if (validQuizzes.length === 0) {
            res.status(500).json({
                error: 'Failed to generate any quiz questions'
            });
            return;
        }

        log('✅', `Generated ${validQuizzes.length} mastery quiz questions`);

        // Save to database
        try {
            await Quiz.findOneAndUpdate(
                {
                    rootTopic: effectiveRootTopic.toLowerCase().trim(),
                    parentTopic: topic.toLowerCase().trim()
                },
                {
                    rootTopic: effectiveRootTopic.toLowerCase().trim(),
                    parentTopic: topic.toLowerCase().trim(),
                    childTopics: childTopics.map((t: string) => t.toLowerCase().trim()),
                    questions: validQuizzes,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
            log('💾', `Saved quiz to database for: "${topic}"`);
        } catch (saveError: any) {
            log('⚠️', `Failed to save quiz to database: ${saveError.message}`);
            // Continue anyway - quiz was generated successfully
        }

        const responseData = {
            topic,
            quizzes: validQuizzes,
            totalQuestions: validQuizzes.length
        };

        // Cache the result
        await cacheService.set(cacheKey, 'mastery', responseData);

        res.json({
            data: responseData,
            source: 'api'
        });
    } catch (error: any) {
        log('❌', `Error generating mastery quiz: ${error.message}`);
        res.status(500).json({
            error: 'Failed to generate mastery quiz',
            message: error.message || 'Unknown error'
        });
    }
}

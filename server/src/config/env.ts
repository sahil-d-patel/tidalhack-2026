import dotenv from 'dotenv';

dotenv.config();

interface Config {
  featherlessApiKey: string;
  featherlessModel: string;
  geminiApiKey: string;
  mongodbUri: string;
  port: number;
  clientUrl: string;
  useGemini: boolean;
}

// Check if Gemini is enabled
const useGemini = process.env.USE_GEMINI?.toLowerCase() === 'true';

// Base required env vars
const requiredEnvVars = [
  'FEATHERLESS_API_KEY',
  'MONGODB_URI'
];

// Add GEMINI_API_KEY to required vars only if Gemini is enabled
if (useGemini) {
  requiredEnvVars.push('GEMINI_API_KEY');
}

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    `Please copy .env.example to .env and fill in the values.`
  );
}

export const config: Config = {
  featherlessApiKey: process.env.FEATHERLESS_API_KEY!,
  featherlessModel: process.env.FEATHERLESS_MODEL || 'deepseek-ai/DeepSeek-V3.2',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mongodbUri: process.env.MONGODB_URI!,
  port: parseInt(process.env.PORT || '3000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5174',
  useGemini
};


import dotenv from 'dotenv';

dotenv.config();

interface Config {
  featherlessApiKey: string;
  geminiApiKey: string;
  mongodbUri: string;
  port: number;
  clientUrl: string;
}

const requiredEnvVars = [
  'FEATHERLESS_API_KEY',
  'GEMINI_API_KEY',
  'MONGODB_URI'
];

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
  geminiApiKey: process.env.GEMINI_API_KEY!,
  mongodbUri: process.env.MONGODB_URI!,
  port: parseInt(process.env.PORT || '3000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/api.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// API routes
app.use('/api', apiRoutes);

// Error handler must be last
app.use(errorHandler);

// Start server
async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`✓ Server listening on http://localhost:${config.port}`);
    console.log(`✓ Client URL: ${config.clientUrl}`);
  });
}

start();

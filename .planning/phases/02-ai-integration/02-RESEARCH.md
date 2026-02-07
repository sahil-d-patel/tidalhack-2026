# Phase 2: AI Integration - Research

**Researched:** 2026-02-07
**Domain:** AI API integration (Featherless, Gemini), Express backend, MongoDB caching
**Confidence:** MEDIUM-HIGH

## Summary

Phase 2 integrates two AI APIs (Featherless for sub-topic generation, Gemini for summaries/quizzes) with a new Express backend and MongoDB caching layer. The research reveals that both APIs follow modern patterns: Featherless is OpenAI-compatible (use OpenAI SDK), Gemini has an official `@google/genai` SDK, and both support async/await with proper error handling.

The critical constraint is Gemini's December 2025 rate limit reduction (250→20 RPD free tier), making MongoDB caching and demo mode essential for hackathon viability. The architecture follows cache-first middleware pattern: check MongoDB before API calls, store responses with 24hr TTL using MongoDB's native TTL indexes.

Quiz data must be embedded in node data (not fetched separately) to avoid secondary API calls and ensure performance. Express 5's native promise support or express-async-errors package eliminates try-catch boilerplate in async routes.

**Primary recommendation:** Build Express backend with routes → controllers → services architecture, use OpenAI SDK for Featherless (OpenAI-compatible), use @google/genai for Gemini, implement cache-first middleware with MongoDB TTL indexes (24hr expiry), and embed quiz JSON in node.data to prevent double API calls.

## Standard Stack

### Core Backend
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| express | 5.x (beta) or 4.x | HTTP server framework | Undisputed champion for Node.js web frameworks, mature ecosystem |
| mongoose | 8.x+ | MongoDB ODM | Default choice for MongoDB in Node.js, automatic connection pooling |
| dotenv | latest | Environment variable management | Industry standard for .env loading |
| cors | latest | Cross-origin resource sharing | Essential for client-server separation |

### AI SDKs
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openai | latest | Featherless API client | Featherless is OpenAI-compatible, reuse official SDK |
| @google/genai | latest | Gemini API client | Official Google SDK for Gemini 2.0+, TypeScript support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| express-async-errors | latest | Async error handling | If using Express 4.x (Express 5 has native support) |
| node-cache | latest | In-memory fallback cache | Optional: faster than MongoDB for repeated requests |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Express | Fastify, Koa | Express has larger ecosystem, more middleware options |
| OpenAI SDK for Featherless | axios/fetch directly | SDK handles retries, errors, streaming better |
| @google/genai | @google/generative-ai (older) | @google/genai is current for Gemini 2.0+ features |

**Installation:**
```bash
# Backend dependencies
cd server
npm install express mongoose dotenv cors openai @google/genai

# Optional (if using Express 4.x)
npm install express-async-errors

# Dev dependencies
npm install --save-dev typescript @types/express @types/node @types/cors nodemon
```

## Architecture Patterns

### Recommended Project Structure
```
server/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection with pooling
│   ├── models/
│   │   └── CachedResponse.ts  # Mongoose schema with TTL index
│   ├── services/
│   │   ├── featherless.ts     # Featherless API service (sub-topics)
│   │   ├── gemini.ts          # Gemini API service (summaries, quizzes)
│   │   └── cache.ts           # Cache service wrapper
│   ├── controllers/
│   │   ├── scoutController.ts # Handle /api/scout (expand node)
│   │   └── hoverController.ts # Handle /api/hover (fun fact)
│   ├── middleware/
│   │   ├── cache.ts           # Cache-first middleware
│   │   └── errorHandler.ts    # Centralized error handler
│   ├── routes/
│   │   └── api.ts             # All API routes
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── server.ts              # Entry point
├── .env.example
├── .env                        # NOT committed (API keys, DB URI)
├── package.json
└── tsconfig.json
```

### Pattern 1: Cache-First Middleware
**What:** Check MongoDB cache before making API calls, return cached data if fresh (within TTL), otherwise call API and cache response.

**When to use:** All AI API endpoints (/api/scout, /api/hover)

**Example:**
```typescript
// middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import { CachedResponse } from '../models/CachedResponse';

export const cacheMiddleware = (cacheKey: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = cacheKey(req);

    // Check cache
    const cached = await CachedResponse.findOne({ key });

    if (cached) {
      // MongoDB TTL index auto-deletes expired docs
      return res.json({ data: cached.data, source: 'cache' });
    }

    // Cache miss - proceed to API call
    // Controller will handle caching response
    req.cacheKey = key;
    next();
  };
};
```

### Pattern 2: OpenAI SDK for Featherless
**What:** Featherless is OpenAI-compatible, so use the official OpenAI SDK with custom baseURL.

**When to use:** Sub-topic generation (4 branches per click)

**Example:**
```typescript
// services/featherless.ts
// Source: https://featherless.ai/docs/getting-started
import OpenAI from 'openai';

const featherless = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: process.env.FEATHERLESS_API_KEY,
});

export async function generateSubTopics(parentTopic: string): Promise<string[]> {
  const response = await featherless.chat.completions.create({
    model: 'model-name', // Choose from Featherless catalog
    messages: [
      {
        role: 'system',
        content: 'Generate exactly 4 sub-topics as a JSON array of strings.',
      },
      {
        role: 'user',
        content: `Parent topic: ${parentTopic}`,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  return JSON.parse(content || '[]');
}
```

### Pattern 3: Gemini SDK for Summaries and Quizzes
**What:** Use official @google/genai SDK for Gemini 2.0+ features.

**When to use:** Fun facts (hover) and quiz generation (stored in node data)

**Example:**
```typescript
// services/gemini.ts
// Source: https://ai.google.dev/gemini-api/docs/quickstart
import { GoogleGenerativeAI } from '@google/genai';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateFunFact(topic: string): Promise<string> {
  const prompt = `Generate a fun, concise fact about ${topic} in 1-2 sentences.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateQuiz(topic: string) {
  const prompt = `Generate a multiple-choice quiz about ${topic}.
Return JSON: { question: string, options: string[], correctIndex: number }
Make it winter-themed if possible.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}
```

### Pattern 4: MongoDB TTL Index for Auto-Expiry
**What:** Use MongoDB's native TTL index to automatically delete expired cache entries after 24 hours.

**When to use:** CachedResponse model

**Example:**
```typescript
// models/CachedResponse.ts
import mongoose from 'mongoose';

const cachedResponseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // TTL: 24 hours in seconds
  },
});

export const CachedResponse = mongoose.model('CachedResponse', cachedResponseSchema);
```

### Pattern 5: Async Error Handling with Express 5 or express-async-errors
**What:** Eliminate try-catch boilerplate in async route handlers by using Express 5's native promise support or express-async-errors package.

**When to use:** All async route handlers and controllers

**Example (Express 5):**
```typescript
// routes/api.ts
// Express 5 automatically catches rejected promises
router.post('/scout', async (req, res) => {
  const { topic } = req.body;

  // No try-catch needed - errors auto-propagate to error handler
  const subTopics = await scoutController.expandNode(topic);
  res.json({ subTopics });
});
```

**Example (Express 4 with express-async-errors):**
```typescript
// server.ts
import 'express-async-errors'; // Import at top - monkey-patches Express

// Now all async routes automatically catch errors
router.post('/scout', async (req, res) => {
  const subTopics = await scoutController.expandNode(topic);
  res.json({ subTopics });
});
```

### Pattern 6: Embedding Quiz Data in Node Data
**What:** Generate quiz during sub-topic expansion and embed in node.data to avoid second API call.

**When to use:** /api/scout endpoint (node expansion)

**Example:**
```typescript
// controllers/scoutController.ts
export async function expandNode(parentTopic: string) {
  // Generate sub-topics
  const subTopics = await featherlessService.generateSubTopics(parentTopic);

  // Generate quizzes for each sub-topic (parallel)
  const quizzesPromises = subTopics.map(topic =>
    geminiService.generateQuiz(topic)
  );
  const quizzes = await Promise.all(quizzesPromises);

  // Return sub-topics with embedded quiz data
  return subTopics.map((topic, index) => ({
    label: topic,
    quiz: quizzes[index], // Embedded in node data
  }));
}
```

### Pattern 7: Three-Layer Architecture (Routes → Controllers → Services)
**What:** Separate concerns: routes handle HTTP, controllers orchestrate logic, services handle business logic and external APIs.

**When to use:** All backend code organization

**Example:**
```typescript
// routes/api.ts
router.post('/scout', scoutController.expandNode);

// controllers/scoutController.ts
export async function expandNode(req: Request, res: Response) {
  const { topic } = req.body;
  const cacheKey = `scout:${topic}`;

  // Check cache
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ data: cached, source: 'cache' });

  // Call service
  const result = await scoutService.expandTopic(topic);

  // Cache result
  await cacheService.set(cacheKey, result);

  res.json({ data: result, source: 'api' });
}

// services/scoutService.ts
export async function expandTopic(topic: string) {
  const subTopics = await featherlessService.generateSubTopics(topic);
  const quizzes = await Promise.all(
    subTopics.map(t => geminiService.generateQuiz(t))
  );

  return subTopics.map((label, i) => ({ label, quiz: quizzes[i] }));
}
```

### Anti-Patterns to Avoid
- **Try-catch in every async route**: Use Express 5 or express-async-errors instead
- **Creating new DB connection per request**: Mongoose handles pooling automatically
- **Storing quiz data separately**: Embed in node data to avoid second API call
- **Ignoring rate limits**: Implement caching and demo mode for Gemini's 20 RPD limit
- **Committing .env file**: Use .env.example for documentation, .gitignore .env
- **Not validating environment variables**: Fail fast at startup if API keys missing

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| API retries and error handling | Custom fetch wrapper | OpenAI SDK for Featherless | SDK handles rate limits, retries, streaming, errors |
| MongoDB connection pooling | Manual connection management | Mongoose default pooling | Mongoose auto-manages connections, pools reused per process |
| Cache expiration logic | Manual TTL checks | MongoDB TTL index | Database auto-deletes expired docs, no cron jobs needed |
| Async error handling | try-catch in every route | express-async-errors or Express 5 | Automatic error propagation to centralized handler |
| Environment variable validation | Manual checks scattered in code | Centralized config validation at startup | Fail fast before server starts |
| CORS configuration | Custom headers | cors package | Handles preflight, credentials, origin validation |

**Key insight:** AI APIs have complex error modes (rate limits, token limits, model availability). Using official SDKs prevents reimplementing retry logic, streaming, and error handling. MongoDB TTL indexes eliminate custom expiration logic. Express ecosystem packages solve common problems better than custom solutions.

## Common Pitfalls

### Pitfall 1: Gemini Rate Limit Surprises
**What goes wrong:** Free tier quota dropped 92% in December 2025 (250→20 RPD). Developers hit limits quickly during development/demos.

**Why it happens:** Google shifted compute to Gemini 3.0 models, enforcing strict per-minute rate limits.

**How to avoid:**
- Implement MongoDB caching with 24hr TTL from day one
- Build demo mode toggle that uses pre-cached responses (no live API)
- Use Gemini 2.5 Flash (not Pro) for higher limits
- Consider batching quiz generation (generate multiple topics at once)

**Warning signs:**
- 429 errors in development
- API calls timing out or rate limited
- Free tier quota exhausted mid-demo

**Sources:**
- [Gemini API Free Tier Rate Limits 2026](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits)
- [Gemini Rate Limit Discussion](https://discuss.ai.google.dev/t/gemini-rate-limit-20-rpd/111274)

### Pitfall 2: Unbounded Arrays in MongoDB Documents
**What goes wrong:** If caching all API responses in a single document with growing arrays, you can hit MongoDB's 16MB document size limit and performance degrades.

**Why it happens:** MongoDB documents have hard 16MB limit. Arrays that grow indefinitely cause performance issues.

**How to avoid:**
- Use separate documents per cached topic (one document per cache key)
- Use TTL indexes to auto-delete old entries
- Never append to arrays without bounds

**Warning signs:**
- Document size warnings in MongoDB logs
- Slow query performance on cached collections
- Memory usage growing over time

**Sources:**
- [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)
- [Mongoose Schema Design](https://medium.com/@babarbilal303/best-practices-for-designing-scalable-mongodb-models-with-mongoose-98972e6624e4)

### Pitfall 3: Not Validating Environment Variables at Startup
**What goes wrong:** Server starts successfully but crashes on first API call because FEATHERLESS_API_KEY or GEMINI_API_KEY is missing.

**Why it happens:** Environment variables are accessed lazily (when API call happens), not at startup.

**How to avoid:**
- Validate all required env vars in server.ts before starting Express
- Throw errors with clear messages if vars missing
- Use TypeScript enums or constants for env var names

**Warning signs:**
- Server starts but crashes on first request
- "API key undefined" errors in production
- Different behavior in dev vs production

**Example:**
```typescript
// config/env.ts
const required = ['FEATHERLESS_API_KEY', 'GEMINI_API_KEY', 'MONGODB_URI'];
required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

**Sources:**
- [dotenv Configuration Best Practices](https://oneuptime.com/blog/post/2026-01-25-dotenv-configuration-nodejs/view)
- [Node.js Production Environment Variables](https://oneuptime.com/blog/post/2026-01-06-nodejs-production-environment-variables/view)

### Pitfall 4: Forgetting CORS for Vite Dev Server
**What goes wrong:** Frontend can't reach backend during development (CORS errors in browser console).

**Why it happens:** Vite dev server runs on http://localhost:5173, Express on http://localhost:3000 (different origins).

**How to avoid:**
- Install and configure cors package in Express
- Set `origin: process.env.CLIENT_URL || 'http://localhost:5173'` for dev
- Use credentials: true if sending cookies/auth headers

**Warning signs:**
- "CORS policy" errors in browser console
- Preflight OPTIONS requests failing
- API works in Postman but not browser

**Example:**
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

**Sources:**
- [Express CORS Best Practices](https://article.arunangshudas.com/how-would-you-manage-cors-in-a-production-express-js-application-45a1138dd6df)
- [CORS Configuration Guide](https://www.wisp.blog/blog/the-ultimate-guide-to-setting-up-your-dev-environment-for-cors-and-live-apis)

### Pitfall 5: Double API Calls for Quiz Data
**What goes wrong:** Click node → fetch sub-topics → render nodes → open quiz → fetch quiz data (second API call, wasting rate limits).

**Why it happens:** Quiz data stored separately instead of embedded in node data.

**How to avoid:**
- Generate quiz data during /api/scout call
- Embed quiz JSON in node.data.quiz
- Frontend reads quiz from node data (no API call)

**Warning signs:**
- Doubled API usage
- Quiz loading delay after node click
- Rate limits hit faster than expected

**Example (CORRECT):**
```typescript
// Backend returns this
{
  subTopics: [
    {
      label: 'Milky Way',
      quiz: { question: '...', options: [...], correctIndex: 0 }
    }
  ]
}

// Frontend stores in node data
const newNode = {
  id: generateId(),
  data: {
    label: subTopic.label,
    quiz: subTopic.quiz // Embedded, no second fetch needed
  }
};
```

### Pitfall 6: Not Handling OpenAI SDK Errors Properly
**What goes wrong:** OpenAI SDK throws errors for rate limits, invalid responses, network issues. If not caught, server crashes.

**Why it happens:** SDK throws exceptions for API errors (429, 500, timeouts).

**How to avoid:**
- Use centralized error handler middleware
- Catch SDK errors in services, rethrow with context
- Return user-friendly messages (don't expose API keys or internal errors)

**Warning signs:**
- Server crashes on API errors
- Error messages expose internal details
- No fallback behavior for API failures

**Example:**
```typescript
// services/featherless.ts
try {
  const response = await featherless.chat.completions.create({...});
  return parseResponse(response);
} catch (error) {
  if (error.status === 429) {
    throw new Error('Rate limit exceeded. Try again later.');
  }
  throw new Error('Failed to generate sub-topics.');
}
```

**Sources:**
- [Express Error Handling Best Practices](https://expressjs.com/en/guide/error-handling.html)
- [Node.js Error Handling Patterns](https://oneuptime.com/blog/post/2026-01-22-nodejs-error-handling-patterns/view)

### Pitfall 7: Mongoose Connection Not Awaited Before Server Start
**What goes wrong:** Server starts before MongoDB connection established, first requests fail with connection errors.

**Why it happens:** `mongoose.connect()` is async but server starts immediately without waiting.

**How to avoid:**
- Await mongoose.connect() before app.listen()
- Log connection success/failure clearly
- Exit process if connection fails (fail fast)

**Warning signs:**
- "MongoNotConnectedError" on first request
- Server appears healthy but can't serve requests
- Intermittent errors depending on connection timing

**Example:**
```typescript
// server.ts
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Fail fast
  }
}

startServer();
```

**Sources:**
- [MongoDB Connection Best Practices](https://medium.com/@ravipatel.it/optimizing-mongodb-connections-with-connection-pooling-in-node-js-expressjs-4acce957d023)
- [Mongoose Connections Guide](https://www.geeksforgeeks.org/mongodb/mongoose-connections/)

## Code Examples

Verified patterns from official sources and best practices:

### MongoDB Connection with Pooling
```typescript
// config/db.ts
// Source: https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      // Mongoose handles pooling automatically
      // Default pool size is 5 (good for most apps)
      maxPoolSize: 10, // Optional: increase for high traffic
      minPoolSize: 2,  // Optional: keep minimum connections warm
    });
    console.log('✓ MongoDB connected with connection pooling');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
}
```

### Cache-First API Flow
```typescript
// controllers/scoutController.ts
import { Request, Response } from 'express';
import { CachedResponse } from '../models/CachedResponse';
import * as scoutService from '../services/scoutService';

export async function expandNode(req: Request, res: Response) {
  const { topic } = req.body;
  const cacheKey = `scout:${topic}`;

  // 1. Check cache first
  const cached = await CachedResponse.findOne({ key: cacheKey });
  if (cached) {
    return res.json({
      data: cached.data,
      source: 'cache',
      timestamp: cached.createdAt
    });
  }

  // 2. Cache miss - call API
  const result = await scoutService.expandTopic(topic);

  // 3. Store in cache
  await CachedResponse.create({
    key: cacheKey,
    data: result,
  });

  res.json({ data: result, source: 'api' });
}
```

### Centralized Error Handler
```typescript
// middleware/errorHandler.ts
// Source: https://expressjs.com/en/guide/error-handling.html
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err.message);

  // Don't expose internal errors to client
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

// Usage in server.ts
app.use(errorHandler); // MUST be last middleware
```

### Zustand Store with Async Actions
```typescript
// client/src/state/canvasStore.ts
// Source: https://github.com/pmndrs/zustand
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

type CanvasStore = {
  nodes: Node[];
  edges: Edge[];
  isExpanding: boolean;
  error: string | null;

  // Async action to expand node
  expandNode: (nodeId: string, topic: string) => Promise<void>;
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isExpanding: false,
  error: null,

  expandNode: async (nodeId: string, topic: string) => {
    set({ isExpanding: true, error: null });

    try {
      // Call backend API
      const response = await fetch('http://localhost:3000/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('API call failed');

      const { data } = await response.json();

      // Add new nodes and edges to store
      const parentNode = get().nodes.find(n => n.id === nodeId);
      const newNodes = data.subTopics.map((sub: any, i: number) => ({
        id: `${nodeId}-${i}`,
        type: 'snowball',
        position: {
          x: parentNode!.position.x + (i - 1.5) * 200,
          y: parentNode!.position.y + 150,
        },
        data: {
          label: sub.label,
          quiz: sub.quiz, // Embedded quiz data
        },
      }));

      const newEdges = newNodes.map(node => ({
        id: `e${nodeId}-${node.id}`,
        source: nodeId,
        target: node.id,
        type: 'footprint',
      }));

      set({
        nodes: [...get().nodes, ...newNodes],
        edges: [...get().edges, ...newEdges],
        isExpanding: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isExpanding: false,
      });
    }
  },
}));
```

### React Flow Dynamic Node Addition
```typescript
// client/src/components/canvas/nodes/SnowballNode.tsx
// Source: https://reactflow.dev/examples/nodes/add-node-on-edge-drop
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useCanvasStore } from '../../../state/canvasStore';

export const SnowballNode = memo(({ data, id }: any) => {
  const expandNode = useCanvasStore(state => state.expandNode);
  const isExpanding = useCanvasStore(state => state.isExpanding);

  const handleClick = () => {
    if (!isExpanding) {
      expandNode(id, data.label);
    }
  };

  return (
    <div
      className="snowball-node"
      onClick={handleClick}
      style={{ cursor: isExpanding ? 'wait' : 'pointer' }}
    >
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      {data.quiz && <div className="quiz-indicator">❓</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @google/generative-ai package | @google/genai package | Gemini 2.0+ release | New package supports Gemini 2.0+ features, interactions API |
| Gemini free tier 250 RPD | Gemini free tier 20 RPD | December 7, 2025 | 92% reduction requires aggressive caching and demo mode |
| Manual try-catch in async routes | express-async-errors or Express 5 | Express 5 beta | Automatic promise error handling reduces boilerplate |
| Redis for caching | MongoDB with TTL indexes | Ongoing | Simplifies stack (one DB instead of two), auto-expiry built-in |
| Separate quiz API endpoint | Embed quiz in node data | Best practice | Eliminates second API call, reduces latency and rate limit usage |

**Deprecated/outdated:**
- **@google/generative-ai**: Use @google/genai for Gemini 2.0+ (newer SDK)
- **express-session for API-only backends**: JWT or token-based auth preferred for stateless APIs
- **body-parser package**: Built into Express 4.16+ as express.json()

## Open Questions

1. **Featherless Model Selection**
   - What we know: Featherless has thousands of models, OpenAI-compatible API
   - What's unclear: Which specific model to use for sub-topic generation (need to browse catalog)
   - Recommendation: Test 2-3 popular models (check Featherless docs for recommended models), prioritize speed over quality for hackathon

2. **Demo Mode Implementation**
   - What we know: Demo mode essential for rate limit protection
   - What's unclear: Where to store demo mode data (MongoDB seed vs hardcoded JSON)
   - Recommendation: Create seed script to populate MongoDB with pre-generated responses for 5-10 common topics, add demo toggle in frontend

3. **Node Positioning Algorithm**
   - What we know: React Flow supports dynamic layouts, need to position 4 sub-nodes per expansion
   - What's unclear: Best algorithm for spacing (radial vs grid vs tree layout)
   - Recommendation: Start with simple horizontal spread (see Zustand example), consider dagre layout library if complexity grows

4. **Gemini Prompt Engineering**
   - What we know: Need JSON output for quizzes, fun facts for hover
   - What's unclear: Optimal prompts for winter-themed, educational content
   - Recommendation: Test prompts during implementation, iterate based on output quality (out of research scope)

5. **Error Handling UX**
   - What we know: API calls can fail (rate limits, network, invalid responses)
   - What's unclear: How to handle errors in UI (toast, modal, inline error)
   - Recommendation: Store error state in Zustand, display toast notification (defer UI implementation to planning)

## Sources

### Primary (HIGH confidence)
- [Featherless API Overview](https://featherless.ai/docs/getting-started) - OpenAI-compatible API, base URL, authentication
- [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart) - Official @google/genai SDK, setup
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html) - Official error middleware pattern
- [MongoDB Connection Pools](https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/) - Official pooling configuration
- [Zustand GitHub](https://github.com/pmndrs/zustand) - Official async actions pattern
- [React Flow Examples](https://reactflow.dev/examples/nodes/add-node-on-edge-drop) - Dynamic node addition

### Secondary (MEDIUM confidence)
- [Featherless OpenAI Compatible Format](https://apidog.com/blog/featherless-ai-api/) - Verified via official docs reference
- [Gemini Rate Limit Changes Dec 2025](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits) - Multiple sources confirm 20 RPD
- [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/) - Official MongoDB developer guide
- [Express Project Structure](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/) - Community consensus pattern
- [MongoDB TTL Collections](https://www.geeksforgeeks.org/node-js/how-to-use-ttl-collections-in-mongodb/) - Verified via official docs
- [Express Async Errors Pattern](https://medium.com/@utkuu/error-handling-in-express-js-and-express-async-errors-package-639c91ba3aa2) - Community best practice

### Tertiary (LOW confidence - needs validation)
- Featherless specific model recommendations (not found in search, need to check dashboard)
- Optimal cache TTL duration (24hr is estimate, may need tuning based on content freshness)
- Gemini prompt engineering for winter-themed quizzes (needs testing)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official SDKs documented, Express/Mongoose industry standard
- Architecture: HIGH - Patterns verified via official docs and established best practices
- Pitfalls: MEDIUM-HIGH - Rate limit changes verified (multiple sources), other pitfalls from community experience
- Code examples: MEDIUM - Synthesized from official docs, not copy-paste production code

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable technologies, but AI API landscape evolves quickly)

**Key uncertainties:**
- Featherless model catalog (need to browse dashboard)
- Exact prompt engineering for quiz quality
- Demo mode storage strategy (MongoDB seed vs JSON file)
- Node positioning algorithm complexity

**Recommended next steps:**
1. Choose Featherless model from catalog (check docs/dashboard)
2. Test Gemini prompts for quiz generation quality
3. Decide demo mode data source (MongoDB seed script vs static JSON)
4. Plan node positioning algorithm (simple spread vs layout library)

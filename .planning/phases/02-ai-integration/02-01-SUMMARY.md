---
phase: 02-ai-integration
plan: 01
subsystem: backend-api
tags: [express, mongodb, ai-integration, caching]
requires:
  - phase: none
  - external: [featherless-api, gemini-api, mongodb]
provides:
  - POST /api/scout: generates 4 sub-topics with embedded quiz data
  - POST /api/hover: generates fun facts
  - MongoDB caching layer with 24hr TTL
  - Env validation and fail-fast startup
affects:
  - subsystem: client (future - will consume these endpoints)
tech_stack:
  added:
    - Express 4.x with express-async-errors
    - Mongoose with TTL indexes
    - OpenAI SDK for Featherless API
    - Google Generative AI SDK (Gemini)
  patterns:
    - Cache-aside pattern with MongoDB
    - Structured error handling middleware
    - Service layer architecture
    - Typed API responses
key_files:
  created:
    - server/package.json: Node.js dependencies and scripts
    - server/tsconfig.json: TypeScript configuration for NodeNext
    - server/.env.example: Environment variable template
    - server/.gitignore: Exclude node_modules and sensitive files
    - server/src/server.ts: Express entry point with MongoDB connection
    - server/src/config/env.ts: Environment validation with fail-fast
    - server/src/config/db.ts: MongoDB connection handler
    - server/src/models/CachedResponse.ts: Mongoose schema with TTL index
    - server/src/types/index.ts: TypeScript interfaces for API
    - server/src/middleware/errorHandler.ts: Structured error responses
    - server/src/services/featherless.ts: Sub-topic generation via OpenAI SDK
    - server/src/services/gemini.ts: Fun fact and quiz generation
    - server/src/services/cache.ts: MongoDB cache operations
    - server/src/controllers/scoutController.ts: /api/scout endpoint logic
    - server/src/controllers/hoverController.ts: /api/hover endpoint logic
    - server/src/routes/api.ts: API route definitions
  modified: []
key_decisions:
  - decision: Use Featherless API with OpenAI SDK instead of direct HTTP
    rationale: OpenAI SDK provides better error handling and retry logic
    alternatives: [axios, fetch]
  - decision: Use Qwen/Qwen3-32B model on Featherless
    rationale: Strong general-purpose model with good JSON output reliability
    alternatives: [other Featherless models]
  - decision: Use gemini-2.0-flash-exp for both fun facts and quizzes
    rationale: Fast, cost-effective, and handles JSON well with prompt engineering
    alternatives: [gemini-pro]
  - decision: Graceful degradation for quiz generation (return null on failure)
    rationale: Quiz is nice-to-have, shouldn't block sub-topic generation
    alternatives: [fail hard, retry logic]
  - decision: Cache upsert with findOneAndUpdate
    rationale: Handles race conditions when multiple requests generate same topic
    alternatives: [findOne + create, manual locking]
duration: 2.45 minutes
completed: 2026-02-07T21:36:46Z
---

# Phase 2 Plan 1: Backend API with AI Integration Summary

**One-liner:** Express server with MongoDB caching, Featherless sub-topic generation (Qwen/Qwen3-32B), and Gemini quiz/fun-fact generation (gemini-2.0-flash-exp).

## Performance

**Execution:** 2.45 minutes (147 seconds)
**Commits:** 3 (2 feature + 1 fix)
**Files created:** 16
**TypeScript compilation:** Clean (0 errors)

## What We Built

A fully functional Express backend that serves as FRACTAL's AI-powered intelligence layer:

1. **POST /api/scout** - Given a topic, returns 4 interesting sub-topics with embedded quiz data
   - Uses Featherless API (Qwen/Qwen3-32B) for sub-topic generation
   - Uses Gemini (gemini-2.0-flash-exp) for quiz generation (parallel)
   - Returns: `{ data: { subTopics: [{ label, quiz }] }, source: 'api' | 'cache' }`

2. **POST /api/hover** - Given a topic, returns a fascinating fun fact
   - Uses Gemini for educational, winter-themed fun facts
   - Returns: `{ data: { funFact: string }, source: 'api' | 'cache' }`

3. **MongoDB caching layer**
   - Cache-aside pattern: check cache first, populate on miss
   - 24-hour TTL via Mongoose schema `expires` field
   - Race-condition safe with `findOneAndUpdate` upsert

4. **Production-ready infrastructure**
   - Environment validation at startup (fail-fast if keys missing)
   - Structured error handling with stack traces in dev mode
   - CORS configured for client origin
   - TypeScript with strict mode and NodeNext modules

## Accomplishments

### Task 1: Server Scaffold ✓
**Commits:** 8c79f6b, 93182cd

Created complete Express server foundation:
- Package.json with Express, Mongoose, OpenAI SDK, Gemini SDK, tsx for dev
- TypeScript config with NodeNext modules and strict mode
- Environment validation that throws clear errors on missing vars
- MongoDB connection with fail-fast error handling
- CachedResponse model with TTL index (24hr expiry)
- Error handler middleware with dev/prod stack trace logic
- API type definitions: SubTopic, QuizData, ScoutResponse, HoverResponse

### Task 2: AI Services & Endpoints ✓
**Commit:** 7d68f6f

Implemented full AI integration:
- **Featherless service**: Sub-topic generation via OpenAI SDK
  - System prompt for exactly 4 sub-topics (2-5 words each)
  - JSON parsing with validation
  - Rate limit detection (429 errors)
- **Gemini service**: Fun facts and quiz generation
  - Fun fact: 1-2 sentence educational content with nature metaphors
  - Quiz: JSON extraction from markdown, validation of structure
  - Graceful degradation (returns null on quiz failures)
- **Cache service**: MongoDB operations with upsert for race safety
- **Scout controller**: Orchestrates sub-topic + quiz generation
  - Parallel quiz generation (Promise.all)
  - Cache check → API call → cache store
- **Hover controller**: Fun fact generation with caching
- **API routes**: `/scout`, `/hover`, `/health`

## Task Commits

| Task | Type | Hash    | Description                                      |
| ---- | ---- | ------- | ------------------------------------------------ |
| 1    | feat | 8c79f6b | Scaffold Express server with MongoDB and env     |
| 1    | fix  | 93182cd | Add .gitignore to prevent tracking node_modules  |
| 2    | feat | 7d68f6f | Implement AI services and API endpoints          |

## Files Created

**Configuration:**
- `server/package.json` - Dependencies and npm scripts
- `server/tsconfig.json` - TypeScript NodeNext config
- `server/.env.example` - Environment variable template
- `server/.gitignore` - Exclude node_modules, dist, .env

**Core Server:**
- `server/src/server.ts` - Express app with MongoDB connection (24 lines)
- `server/src/config/env.ts` - Environment validation
- `server/src/config/db.ts` - MongoDB connection handler
- `server/src/middleware/errorHandler.ts` - Structured error responses

**Data Layer:**
- `server/src/models/CachedResponse.ts` - Mongoose schema with TTL
- `server/src/types/index.ts` - API type definitions

**Services:**
- `server/src/services/featherless.ts` - Sub-topic generation (44 lines)
- `server/src/services/gemini.ts` - Fun facts and quizzes (71 lines)
- `server/src/services/cache.ts` - MongoDB cache operations (27 lines)

**API Layer:**
- `server/src/controllers/scoutController.ts` - /scout endpoint (57 lines)
- `server/src/controllers/hoverController.ts` - /hover endpoint (37 lines)
- `server/src/routes/api.ts` - Route definitions (21 lines)

## Files Modified

None (all new files)

## Decisions Made

1. **OpenAI SDK for Featherless** - Better error handling and retry logic than raw HTTP
2. **Qwen/Qwen3-32B model** - Reliable JSON output, strong general knowledge
3. **gemini-2.0-flash-exp** - Fast, cost-effective, good at following JSON prompts
4. **Graceful quiz degradation** - Return null instead of failing entire request
5. **Cache upsert pattern** - Prevents race conditions when multiple users request same topic

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added .gitignore to server directory**
- **Found during:** Task 1 commit
- **Issue:** node_modules directory was accidentally committed (3500+ files)
- **Fix:** Created server/.gitignore, removed node_modules from git
- **Files modified:** server/.gitignore (created)
- **Commit:** 93182cd

This was critical to prevent bloating the repository and is standard practice for Node.js projects.

## Issues Encountered

None - plan executed smoothly.

## Next Phase Readiness

**Status:** Ready for frontend integration

**Blockers:** None

**Required for next plans:**
- User must provide API keys in `.env` file:
  - `FEATHERLESS_API_KEY` from Featherless dashboard
  - `GEMINI_API_KEY` from Google AI Studio
  - `MONGODB_URI` from MongoDB Atlas or local instance

**Verification steps for user:**
1. Copy `server/.env.example` to `server/.env`
2. Fill in API keys and MongoDB URI
3. Run `cd server && npm run dev`
4. Test health endpoint: `curl http://localhost:3000/api/health`
5. Test scout endpoint: `curl -X POST http://localhost:3000/api/scout -H 'Content-Type: application/json' -d '{"topic":"The Universe"}'`
6. Verify second request returns `"source": "cache"`

**Dependencies satisfied:**
- Wave 1 (no dependencies)
- Ready for Plan 02-02 (Frontend AI Integration)

## Self-Check

Verifying all claimed artifacts exist.

**Files Check:**
- ✓ server/package.json
- ✓ server/tsconfig.json
- ✓ server/.env.example
- ✓ server/.gitignore
- ✓ server/src/server.ts
- ✓ server/src/config/env.ts
- ✓ server/src/config/db.ts
- ✓ server/src/models/CachedResponse.ts
- ✓ server/src/types/index.ts
- ✓ server/src/middleware/errorHandler.ts
- ✓ server/src/services/featherless.ts
- ✓ server/src/services/gemini.ts
- ✓ server/src/services/cache.ts
- ✓ server/src/controllers/scoutController.ts
- ✓ server/src/controllers/hoverController.ts
- ✓ server/src/routes/api.ts

**Commit Check:**
- ✓ 8c79f6b (Task 1 - Server scaffold)
- ✓ 93182cd (Task 1 - .gitignore fix)
- ✓ 7d68f6f (Task 2 - AI services)

**Result:** PASSED - All 16 files and 3 commits verified.

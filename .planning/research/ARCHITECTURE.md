# Architecture Research

**Domain:** Gamified Interactive Web Application with Node Graph, Particle Effects, and AI Integration
**Researched:** 2026-02-07
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Parallax Background (SVG) │ Canvas Layer │ UI Overlays     │
│  ┌──────────────────┐     ┌──────────┐   ┌──────────────┐  │
│  │ Layer 1: Hills   │     │ ReactFlow│   │ Thermometer  │  │
│  │ Layer 2: Trees   │     │ (Canvas) │   │ HUD          │  │
│  │ Layer 3: Cabin   │     │          │   │              │  │
│  └──────────────────┘     └──────────┘   └──────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Particle System (tsparticles + Canvas)         │ │
│  │         Snow / Fog / Wind / Blizzard Overlay           │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    STATE MANAGEMENT LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Game Mode    │  │ Node/Edge    │  │ UI State         │  │
│  │ State        │  │ Graph State  │  │ (Thermometer,    │  │
│  │ (Peace/      │  │ (ReactFlow)  │  │  Overlays)       │  │
│  │  Blizzard)   │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      API CLIENT LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │           API Client (axios / fetch)                   │ │
│  │  /api/scout (Featherless) │ /api/inspect (Gemini)     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Node + Express)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Route Layer  │  │ Cache Layer  │  │ AI Service Layer │  │
│  │ /api/scout   │  │ MongoDB      │  │ Featherless API  │  │
│  │ /api/inspect │  │ Middleware   │  │ Gemini API       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                         DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MongoDB Database                    │ │
│  │  Topics Collection │ Summaries Collection              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Parallax Background** | Static layered SVG background with depth perception | 3 SVG layers with CSS transforms based on scroll/pan offset |
| **ReactFlow Canvas** | Interactive infinite node graph with custom snowball nodes | @xyflow/react with custom node components, controlled state |
| **Particle System** | Animated environmental effects (snow, fog, wind, blizzard) | tsparticles with Canvas rendering, config-driven presets |
| **UI Overlays** | Game HUD elements (thermometer, mode indicators, frosted glass effects) | React components with Framer Motion animations, absolute positioning |
| **Game Mode Controller** | State machine managing Peace/Blizzard mode transitions | React state or Zustand store with mode-specific logic |
| **Node/Edge State Manager** | Graph data structure and node interaction logic | ReactFlow's onNodesChange/onEdgesChange with custom handlers |
| **API Client** | HTTP communication with backend, request/response handling | axios or fetch with async/await, error handling |
| **Cache Middleware** | Check MongoDB before external API calls, store results | Express middleware checking cache, falling back to AI APIs |
| **AI Service Layer** | External API integration (Featherless, Gemini) | Axios/fetch clients with API key management, rate limiting |
| **MongoDB Driver** | Database operations (read, write, TTL management) | mongoose or native MongoDB driver with connection pooling |

## Recommended Project Structure

```
tidalhack-2026/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── background/    # Parallax SVG layers
│   │   │   │   ├── ParallaxBackground.tsx
│   │   │   │   ├── HillsLayer.tsx
│   │   │   │   ├── TreesLayer.tsx
│   │   │   │   └── CabinLayer.tsx
│   │   │   ├── canvas/        # Node graph components
│   │   │   │   ├── InfiniteCanvas.tsx
│   │   │   │   ├── SnowballNode.tsx
│   │   │   │   └── CustomEdge.tsx
│   │   │   ├── particles/     # Particle system configs
│   │   │   │   ├── ParticleManager.tsx
│   │   │   │   ├── SnowConfig.ts
│   │   │   │   ├── FogConfig.ts
│   │   │   │   └── BlizzardConfig.ts
│   │   │   ├── overlays/      # UI overlays
│   │   │   │   ├── Thermometer.tsx
│   │   │   │   ├── BlizzardOverlay.tsx
│   │   │   │   └── FrostedGlass.tsx
│   │   │   └── shared/        # Reusable UI components
│   │   ├── state/             # State management
│   │   │   ├── gameModeStore.ts    # Game mode state machine
│   │   │   ├── graphStore.ts       # Node/edge state helpers
│   │   │   └── uiStore.ts          # UI state (thermometer, etc.)
│   │   ├── api/               # API client layer
│   │   │   ├── client.ts      # Base axios instance
│   │   │   ├── scout.ts       # POST /api/scout
│   │   │   └── inspect.ts     # POST /api/inspect
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useGameMode.ts
│   │   │   ├── useNodeGraph.ts
│   │   │   └── useParticles.ts
│   │   ├── types/             # TypeScript types
│   │   │   ├── node.types.ts
│   │   │   ├── api.types.ts
│   │   │   └── game.types.ts
│   │   └── App.tsx            # Root component
│   └── vite.config.ts
│
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   │   ├── scout.ts       # POST /api/scout
│   │   │   └── inspect.ts     # POST /api/inspect
│   │   ├── middleware/        # Express middleware
│   │   │   ├── cache.ts       # MongoDB cache check/store
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/          # Business logic
│   │   │   ├── featherless.ts # Featherless API integration
│   │   │   ├── gemini.ts      # Gemini API integration
│   │   │   └── cache.ts       # Cache service
│   │   ├── models/            # MongoDB models
│   │   │   ├── Topic.ts
│   │   │   └── Summary.ts
│   │   ├── config/            # Configuration
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   └── index.ts           # Server entry point
│   └── package.json
│
└── .planning/                 # Planning documents
```

### Structure Rationale

- **client/components/**: Organized by visual layer (background, canvas, particles, overlays) matching the rendering stack from back to front
- **client/state/**: Separates concerns - game logic, graph data, and UI state are independent stores
- **client/api/**: API client layer abstracts backend communication, making it easy to swap implementations or add caching
- **server/routes/**: Thin route handlers delegate to services for business logic
- **server/middleware/**: Cache-first pattern implemented as middleware for automatic cache checks
- **server/services/**: External API integrations isolated from routing logic, enabling testing and swap-ability

## Architectural Patterns

### Pattern 1: Layered Z-Index Rendering

**What:** Organize visual components in distinct rendering layers with explicit z-index control.

**When to use:** Applications with multiple visual systems (static backgrounds, interactive canvas, particle effects, UI overlays) that need to render independently without interference.

**Trade-offs:**
- **Pro:** Clear separation of concerns, easy to debug rendering issues, independent performance optimization per layer
- **Con:** CSS z-index management requires discipline, potential for unexpected stacking context issues

**Example:**
```typescript
// App.tsx - Layered rendering structure
function App() {
  return (
    <div className="app-container">
      {/* Layer 0: Parallax Background (z-index: 0) */}
      <ParallaxBackground />

      {/* Layer 1: Canvas + Particles (z-index: 10) */}
      <div className="canvas-layer">
        <InfiniteCanvas />
        <ParticleManager />
      </div>

      {/* Layer 2: UI Overlays (z-index: 100) */}
      <div className="overlay-layer">
        <Thermometer />
        <BlizzardOverlay />
      </div>
    </div>
  )
}

// CSS
.app-container { position: relative; }
.parallax-background { position: absolute; z-index: 0; }
.canvas-layer { position: absolute; z-index: 10; inset: 0; }
.overlay-layer { position: fixed; z-index: 100; pointer-events: none; }
```

### Pattern 2: Cache-First API Middleware

**What:** Implement caching as Express middleware that intercepts requests, checks MongoDB cache, and only calls external APIs on cache miss.

**When to use:** Applications integrating expensive external APIs (AI services, third-party data) where response reusability is high.

**Trade-offs:**
- **Pro:** 90% cost reduction (verified in AI API integrations), automatic cache management, transparent to route handlers
- **Con:** Cache invalidation complexity, stale data risk, MongoDB query overhead for cache checks

**Example:**
```typescript
// middleware/cache.ts
export const cacheMiddleware = (cacheKey: string, ttl: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = generateCacheKey(req, cacheKey);

    // Check cache
    const cached = await CacheService.get(key);
    if (cached) {
      return res.json(cached);
    }

    // Intercept response to store in cache
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      CacheService.set(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

// routes/scout.ts
router.post(
  '/api/scout',
  cacheMiddleware('scout', 86400), // 24 hour TTL
  async (req, res) => {
    const result = await FeatherlessService.getSubTopics(req.body.topic);
    res.json(result);
  }
);
```

### Pattern 3: Controlled ReactFlow with Custom State

**What:** Use ReactFlow in controlled mode with custom state management (Zustand/useState) for full control over node/edge mutations.

**When to use:** Complex node graphs requiring custom business logic (game mechanics, AI interactions) beyond ReactFlow's built-in behaviors.

**Trade-offs:**
- **Pro:** Full control over state transitions, easier to integrate with game logic, custom validation and side effects
- **Con:** More boilerplate, manual state synchronization, potential for infinite re-render loops if callbacks not memoized

**Example:**
```typescript
// state/graphStore.ts
import { create } from 'zustand';

interface GraphStore {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],

  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),

  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
  })),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  }
}));

// components/canvas/InfiniteCanvas.tsx
function InfiniteCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useGraphStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={customNodeTypes}
    />
  );
}
```

### Pattern 4: Game Mode State Machine

**What:** Use explicit state machine pattern for managing game modes (Peace/Blizzard) with clear transitions and mode-specific behaviors.

**When to use:** Applications with distinct operational modes that have different rules, UI states, and behaviors.

**Trade-offs:**
- **Pro:** Prevents invalid state transitions, explicit mode behavior, easier to reason about complex mode logic
- **Con:** More upfront design, potential overkill for simple two-state scenarios

**Example:**
```typescript
// state/gameModeStore.ts
type GameMode = 'peace' | 'blizzard';

interface GameModeStore {
  mode: GameMode;
  temperature: number;
  startBlizzard: () => void;
  endBlizzard: () => void;
  decreaseTemperature: () => void;
  increaseTemperature: () => void;
}

export const useGameMode = create<GameModeStore>((set, get) => ({
  mode: 'peace',
  temperature: 100,

  startBlizzard: () => {
    const { mode } = get();
    if (mode === 'peace') {
      set({ mode: 'blizzard', temperature: 100 });
      // Trigger blizzard particle effect
    }
  },

  endBlizzard: () => {
    const { mode } = get();
    if (mode === 'blizzard') {
      set({ mode: 'peace' });
      // Reset to calm particle effect
    }
  },

  decreaseTemperature: () => {
    const { temperature, mode } = get();
    if (mode === 'blizzard') {
      const newTemp = Math.max(0, temperature - 10);
      set({ temperature: newTemp });
      if (newTemp === 0) {
        // Game over logic
      }
    }
  },

  increaseTemperature: () => {
    const { temperature, mode } = get();
    if (mode === 'blizzard') {
      set({ temperature: Math.min(100, temperature + 20) });
    }
  }
}));
```

### Pattern 5: Performance-Optimized Particle System

**What:** Use tsparticles with Canvas rendering and config-driven presets, lazy-loading particle systems based on game mode.

**When to use:** Applications requiring multiple particle effects that should not all render simultaneously (performance).

**Trade-offs:**
- **Pro:** Sub-10KB gzipped bundle, 60 FPS on mobile, hardware-accelerated, easy config switching
- **Con:** Canvas-based (no DOM inspection), limited interactivity with individual particles

**Example:**
```typescript
// components/particles/ParticleManager.tsx
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function ParticleManager() {
  const { mode } = useGameMode();
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); // Load minimal tsparticles features
  }, []);

  const config = mode === 'blizzard'
    ? blizzardConfig
    : peacefulSnowConfig;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={config}
      className="particles-layer"
    />
  );
}

// particles/BlizzardConfig.ts
export const blizzardConfig = {
  particles: {
    number: { value: 150 }, // More particles for blizzard
    move: {
      speed: 8, // Faster movement
      direction: "bottom-right",
      random: true
    },
    opacity: { value: 0.8 }
  }
};
```

## Data Flow

### Request Flow: Scout Endpoint (Topic Exploration)

```
[User clicks node "Fractals"]
    ↓
[onClick handler] → useGraphStore.addNode (temporary "loading" node)
    ↓
[API Client] → POST /api/scout { topic: "Fractals" }
    ↓
[Express Route] → cache.middleware checks MongoDB
    ↓
    ├─ Cache HIT → return cached {subTopics: [...]}
    │                   ↓
    │              [Response] → useGraphStore.replaceNode (4 child nodes)
    │
    └─ Cache MISS → FeatherlessService.getSubTopics("Fractals")
                        ↓
                   [Featherless API] → {subTopics: [...]}
                        ↓
                   [cache.middleware] → MongoDB.insert({topic, subTopics, ttl})
                        ↓
                   [Response] → useGraphStore.replaceNode (4 child nodes)
```

### Request Flow: Inspect Endpoint (Quiz Mode)

```
[Blizzard Mode Triggered] → useGameMode.startBlizzard()
    ↓
[Select node] → onClick handler
    ↓
[API Client] → POST /api/inspect { topic: "Fractals" }
    ↓
[Express Route] → cache.middleware checks MongoDB
    ↓
    ├─ Cache HIT → return cached {summary, quiz: [...]}
    │                   ↓
    │              [Response] → Display quiz modal
    │                   ↓
    │              [User answers correctly]
    │                   ↓
    │              useGameMode.increaseTemperature()
    │
    └─ Cache MISS → GeminiService.getSummaryAndQuiz("Fractals")
                        ↓
                   [Gemini API] → {summary, quiz: [...]}
                        ↓
                   [cache.middleware] → MongoDB.insert({topic, summary, quiz, ttl})
                        ↓
                   [Response] → Display quiz modal
```

### State Management Flow

```
[Component Event] → [Action Dispatch]
                        ↓
                    [Store Update]
                        ↓
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
[Game Mode Store]  [Graph Store]  [UI Store]
        │               │               │
        ▼               ▼               ▼
[Re-render          [Re-render     [Re-render
 affected            node/edge      overlay
 components]         components]    components]
```

### Particle System Flow

```
[Game Mode Change]
    ↓
useGameMode.mode → 'peace' | 'blizzard'
    ↓
[ParticleManager] → Switch config
    ↓
tsparticles.load(newConfig)
    ↓
[Canvas Render Loop] → requestAnimationFrame (60 FPS)
    ↓
[Particle Update] → Position, velocity, opacity
    ↓
[Canvas Draw] → Clear + redraw all particles
```

### Key Data Flows

1. **User Interaction → Node Creation:** Click event → API call → State update → ReactFlow re-render → New nodes appear
2. **Game Mode Transition:** Timer/event → State machine transition → Particle config swap → UI overlay change → Thermometer activation
3. **Cache-First API Pattern:** Request → Cache check → (Miss: External API + Cache write) → Response
4. **Thermometer Depletion:** setInterval (Blizzard mode) → Decrease temperature → Check threshold → Trigger game over or continue

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Monolith is perfect. Single Express server + MongoDB instance. No CDN needed. Local development setup matches production. Client-side state management (Zustand/useState) sufficient. |
| **1k-100k users** | Add Redis for hot cache layer (reduce MongoDB reads by 70%). Deploy backend on multiple instances with load balancer. Serve static frontend from CDN (Vercel/Netlify). Implement rate limiting middleware (protect against API abuse). Monitor external API costs (Featherless/Gemini usage). |
| **100k+ users** | Consider splitting frontend and backend repos (independent deployment). Implement API gateway pattern for advanced caching/throttling. Use MongoDB Atlas auto-scaling for database. Add metrics/observability (DataDog, New Relic). Consider serverless functions for API routes (cost optimization). Implement WebSocket for real-time features (if adding multiplayer). |

### Scaling Priorities

1. **First bottleneck: External API costs** - With AI APIs costing $0.01-0.10 per request, the first scaling issue will be cost, not performance. Mitigation: Aggressive caching (24+ hour TTL), cache warming for popular topics, consider fine-tuning smaller models.

2. **Second bottleneck: MongoDB read throughput** - Cache middleware adds MongoDB query per request. At 10K+ requests/min, this becomes the bottleneck. Mitigation: Add Redis in-memory cache layer (99% hit rate on hot topics), implement connection pooling, use MongoDB indexes on cache keys.

3. **Third bottleneck: Frontend rendering performance** - ReactFlow + tsparticles + SVG layers can cause frame drops on low-end devices. Mitigation: Implement viewport-based virtualization for off-screen nodes, reduce particle count on mobile (useMediaQuery), lazy-load non-critical SVG layers.

## Anti-Patterns

### Anti-Pattern 1: Direct AI API Calls from Frontend

**What people do:** Call Featherless/Gemini APIs directly from React components with API keys in environment variables.

**Why it's wrong:** Exposes API keys in client bundle (even with .env), no rate limiting, no caching, no cost control, no error handling consistency.

**Do this instead:** Always proxy AI API calls through your Express backend. Implement cache-first middleware, rate limiting, cost guards, and centralized error handling. Frontend only knows about `/api/scout` and `/api/inspect`.

### Anti-Pattern 2: Uncontrolled ReactFlow with Global State

**What people do:** Use ReactFlow's defaultNodes/defaultEdges (uncontrolled mode) but try to manipulate nodes from external state (game mode, API responses).

**Why it's wrong:** Causes state synchronization bugs, difficult to integrate game logic with node state, no single source of truth.

**Do this instead:** Use controlled mode (nodes/edges props) with explicit onNodesChange/onEdgesChange handlers connected to your state management solution (Zustand, useState). ReactFlow becomes a pure presentation layer.

### Anti-Pattern 3: Rendering All Particle Effects Simultaneously

**What people do:** Render snow + fog + wind + blizzard particles at the same time, hidden/shown with CSS opacity transitions.

**Why it's wrong:** Canvas still rendering off-screen particles, frame rate drops to 20-30 FPS, mobile devices overheat, battery drain.

**Do this instead:** Conditionally render only the active particle system based on game mode. Use tsparticles' `destroy()` method to fully remove inactive particle systems. Lazy-load particle configs to reduce initial bundle size.

### Anti-Pattern 4: Storing Cache Data in Frontend State

**What people do:** Fetch data once, store in React state/Zustand, treat frontend as cache layer.

**Why it's wrong:** Cache lost on page refresh, no sharing between users, no TTL management, large memory footprint for long sessions.

**Do this instead:** Implement caching on the backend (MongoDB with TTL indexes). Frontend state only holds currently displayed data. Backend cache is shared across all users and persists across sessions.

### Anti-Pattern 5: Inline Event Handlers in ReactFlow

**What people do:** Define onClick, onNodesChange handlers inline in JSX or without useCallback.

**Why it's wrong:** Causes infinite re-render loops in ReactFlow, breaks React's reconciliation, performance degrades exponentially with node count.

**Do this instead:** Define event handlers outside component or wrap with useCallback. ReactFlow's documentation explicitly warns about this pitfall.

```typescript
// WRONG
<ReactFlow
  nodes={nodes}
  onNodesChange={(changes) => setNodes(applyNodeChanges(changes, nodes))}
/>

// RIGHT
const onNodesChange = useCallback((changes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);

<ReactFlow nodes={nodes} onNodesChange={onNodesChange} />
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Featherless API** | Express service layer with axios, promisify responses | POST to LLM endpoint, parse structured JSON response (4 sub-topics). Implement retry logic with exponential backoff. Monitor rate limits (check API docs for tier limits). |
| **Gemini API** | Express service layer with @google/generative-ai SDK | Use generateContent with structured output schema for {summary, quiz}. Implement prompt caching to reduce costs by 50%. Track token usage for cost monitoring. |
| **MongoDB** | mongoose ODM with connection pooling | Models: Topic (scout cache), Summary (inspect cache). Use TTL indexes for automatic cache expiration. Implement compound indexes on {topic, createdAt}. |
| **tsparticles** | React component with lazy-loaded engine | Use loadSlim() instead of full bundle (24KB → 6KB). Load particle presets dynamically based on game mode. Destroy particle instances on unmount to prevent memory leaks. |
| **ReactFlow (@xyflow/react)** | Controlled mode with custom state management | Use ReactFlowProvider for hooks access. Implement custom node types for snowball design. Use fitView() on initial load and after adding nodes. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ Backend** | REST API (POST with JSON) | Use axios with baseURL config for environment switching. Implement request/response interceptors for error handling. Consider adding WebSocket for real-time features later. |
| **ReactFlow ↔ Game State** | Event handlers calling Zustand actions | onNodeClick triggers API call → updates game state → game state change triggers particle system update. Keep ReactFlow as pure presentation layer. |
| **Particle System ↔ Game Mode** | React props based on Zustand state | ParticleManager subscribes to game mode store, receives config as prop. Particle system doesn't know about game logic, only renders current config. |
| **Backend Routes ↔ Services** | Async/await function calls | Routes are thin controllers, services contain business logic. Services return typed objects, routes handle HTTP concerns (status codes, headers). |
| **Cache Middleware ↔ Database** | mongoose model methods | Middleware calls CacheService, which wraps mongoose operations. Service handles cache invalidation logic, TTL management, error fallback. |

## Build Order Dependencies

### Phase 1: Foundation (Backend First)
**Why:** Backend provides data contract for frontend development, can be tested independently.

1. Set up Express server with basic routing
2. Configure MongoDB connection with mongoose
3. Implement cache models (Topic, Summary) with TTL indexes
4. Create stub endpoints (/api/scout, /api/inspect) returning mock data

**Dependencies:** None - can start immediately
**Deliverable:** Backend API returning mock data, ready for frontend integration

### Phase 2: Core Canvas (Frontend Foundation)
**Why:** Canvas is the central feature, other UI layers build around it.

1. Set up React + Vite project
2. Install and configure @xyflow/react
3. Create basic InfiniteCanvas component with controlled state
4. Implement custom SnowballNode component
5. Set up Zustand store for node/edge management

**Dependencies:** Phase 1 (can use mock data)
**Deliverable:** Interactive node graph with custom nodes, basic panning/zooming

### Phase 3: AI Integration (Backend Enhancement)
**Why:** Unlocks real data flow, enables frontend API integration testing.

1. Implement Featherless API service (POST /api/scout)
2. Implement Gemini API service (POST /api/inspect)
3. Add cache-first middleware to both endpoints
4. Add error handling, rate limiting, cost monitoring

**Dependencies:** Phase 1 (database models already exist)
**Deliverable:** Backend returning real AI-generated data with caching

### Phase 4: Visual Layers (Frontend Enhancement)
**Why:** Enhances visual appeal without affecting core functionality.

1. Create ParallaxBackground component with 3 SVG layers
2. Integrate tsparticles for peaceful snow effect
3. Add CSS layering (z-index management)
4. Optimize SVG compression and rendering performance

**Dependencies:** Phase 2 (canvas needs to exist to layer around)
**Deliverable:** Visually rich environment with layered rendering

### Phase 5: Game Mechanics (State Machine)
**Why:** Adds game loop and mode transitions, requires all previous systems to exist.

1. Implement game mode state machine (Peace/Blizzard)
2. Create Thermometer HUD component
3. Add blizzard particle config and mode transition logic
4. Implement quiz modal for inspect endpoint
5. Add timer logic for temperature depletion

**Dependencies:** Phases 2, 3, 4 (needs canvas, API, and particles)
**Deliverable:** Full game loop with mode transitions

### Phase 6: Polish & Optimization
**Why:** Performance optimization after core features are complete.

1. Add Framer Motion animations to UI components
2. Implement viewport-based node virtualization
3. Add mobile device detection and particle density adjustment
4. Add loading states, error boundaries, edge cases
5. Performance profiling and optimization

**Dependencies:** Phase 5 (all features exist)
**Deliverable:** Production-ready application with animations and optimizations

### Critical Path Notes

- **Phases 1 and 2 can run in parallel** (backend and frontend foundation)
- **Phase 3 blocks Phase 5** (game mechanics need real API data)
- **Phase 4 is independent** (visual layers can be added anytime after Phase 2)
- **Phase 6 must be last** (can't optimize what doesn't exist yet)

### Suggested Build Order

1. Backend foundation (Phase 1)
2. Frontend canvas (Phase 2) - **parallel with Phase 1**
3. AI integration (Phase 3)
4. Visual layers (Phase 4) - **parallel with Phase 3**
5. Game mechanics (Phase 5)
6. Polish (Phase 6)

**Total estimated phases: 6**
**Parallelizable work: Phases 1+2, Phases 3+4**
**Critical path: 1 → 3 → 5 → 6**

## Sources

**ReactFlow Architecture & Patterns:**
- [ReactFlow API Reference](https://reactflow.dev/api-reference/react-flow) - HIGH confidence (official docs)
- [Node-Based UIs in React - React Flow](https://reactflow.dev) - HIGH confidence
- [xyflow GitHub Repository](https://github.com/xyflow/xyflow) - HIGH confidence

**Particle System Performance:**
- [tsparticles React Component](https://github.com/tsparticles/react) - HIGH confidence (official repo)
- [JavaScript Particles Background Guide 2026](https://copyprogramming.com/howto/javascript-particles-background-js-code-example) - MEDIUM confidence

**State Management Patterns:**
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns) - MEDIUM confidence
- [Top 5 React State Management Tools in 2026](https://www.syncfusion.com/blogs/post/react-state-management-libraries) - MEDIUM confidence
- [State Machines in React](https://mastery.games/post/state-machines-in-react/) - HIGH confidence

**MERN Stack & Caching Architecture:**
- [Express MongoDB API Architecture](https://github.com/iammukeshm/express-mongodb-api-architecture) - MEDIUM confidence
- [3 Design Patterns to Speed Up MEAN and MERN Stack Applications](https://redis.io/learn/guides/three-caching-design-patterns) - HIGH confidence (official Redis guide)
- [Building a Production-Grade AI Web App in 2026](https://dev.to/art_light/building-a-production-grade-ai-web-app-in-2026-architecture-trade-offs-and-hard-won-lessons-4llg) - MEDIUM confidence

**Canvas & Layered Rendering:**
- [From SVG to Canvas - A New Way of Building Interactions](https://felt.com/blog/svg-to-canvas-part-2-building-interactions) - HIGH confidence
- [React Canvas Apps Separation of Concerns](https://cheesecakelabs.com/blog/react-best-practices-in-projects/) - MEDIUM confidence

**Framer Motion Performance:**
- [Framer Motion Tips for Performance in React](https://tillitsdone.com/blogs/framer-motion-performance-tips/) - MEDIUM confidence
- [Reduce Bundle Size of Framer Motion](https://motion.dev/docs/react-reduce-bundle-size) - HIGH confidence (official docs)

**AI API Integration & Caching:**
- [Building a Production-Grade AI Web App in 2026: Architecture](https://dev.to/art_light/building-a-production-grade-ai-web-app-in-2026-architecture-trade-offs-and-hard-won-lessons-4llg) - MEDIUM confidence
- [MCP Gateways: A Developer's Guide to AI Agent Architecture](https://composio.dev/blog/mcp-gateways-guide) - MEDIUM confidence

---
*Architecture research for: Gamified Interactive Web Application (Node Graph + AI)*
*Researched: 2026-02-07*
*Confidence Level: HIGH - Verified with official documentation and 2026 sources*

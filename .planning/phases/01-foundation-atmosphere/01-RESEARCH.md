# Phase 1: Foundation & Atmosphere - Research

**Researched:** 2026-02-07
**Domain:** React Flow infinite canvas, parallax backgrounds, atmospheric UI
**Confidence:** HIGH

## Summary

Phase 1 establishes the core visual foundation: an infinite canvas using @xyflow/react with custom snowball-style nodes, parallax SVG background layers, and a moody atmospheric design system. The research focused on React Flow best practices, Vite 5+ setup, parallax performance patterns, custom node/edge styling, and the supporting stack.

React Flow 12+ (rebranded as @xyflow/react) is the definitive choice for node-based UIs, offering controlled mode with Zustand integration, extensive customization, and strong performance when properly optimized. Vite 5+ has replaced Create React App as the standard React tooling, offering instant dev server starts and near-instant HMR. Parallax effects in 2026 favor pure CSS or framer-motion with careful performance optimization for SVG layers.

The standard stack for this phase combines @xyflow/react for canvas management, Tailwind CSS for styling (optionally enhanced with shadcn/ui components), framer-motion for parallax animations, and tsparticles for atmospheric snow effects. Performance considerations are critical: memoization of custom nodes, avoiding direct nodes/edges subscriptions, simplifying CSS complexity, and using transform/opacity for animations.

**Primary recommendation:** Use @xyflow/react 12+ in controlled mode with Zustand, Vite 5+ with React 18/19, pure CSS parallax for background layers, memoized custom nodes with Tailwind styling, and establish a clear z-index layering system upfront (background: 0, canvas: 10, particles: 20, overlay: 30, HUD: 40).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @xyflow/react | 12.x | Node-based infinite canvas | Industry standard for node graphs, extensive customization, strong performance, built-in Zustand |
| Vite | 5.x - 7.x | Build tool & dev server | Replaced CRA as React standard, instant startup (<300ms), near-instant HMR, ESM-native |
| React | 18.x or 19.x | UI framework | React 19 is latest (Feb 2026), Vite defaults to 18 but 19 is production-ready |
| Tailwind CSS | 3.x or 4.x | Utility-first styling | Standard for rapid UI development, excellent with React Flow custom nodes |
| Zustand | 4.x | State management | Lightweight, React Flow uses internally, perfect for controlled canvas state |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 12.x | Animation & parallax | Scroll-linked parallax, entrance animations, smooth transitions |
| tsparticles | Latest | Particle effects | Snow particles, atmospheric effects (use @tsparticles/react + @tsparticles/preset-snow) |
| shadcn/ui | Latest | UI component library | Optional: Copy-paste Radix UI + Tailwind components for overlays/HUD |
| @fontsource/* | Latest | Self-hosted fonts | Self-host Google Fonts (Fredoka, Nunito) for performance and reliability |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @xyflow/react | react-flow-renderer | @xyflow/react is the new package name (React Flow 12+), react-flow-renderer is deprecated |
| Vite | webpack + CRA | CRA deprecated Feb 2025, webpack slower dev experience, Vite is standard |
| Pure CSS parallax | JavaScript scroll listeners | CSS uses GPU compositor (more performant), JS offers more complex effects |
| framer-motion | CSS animations | framer-motion better for complex scroll-linked effects, CSS for simple transforms |

**Installation:**
```bash
# Core canvas & state
npm install @xyflow/react zustand

# Styling
npm install tailwindcss postcss autoprefixer
npm install @fontsource/fredoka @fontsource/nunito

# Animation & particles
npm install framer-motion
npm install @tsparticles/react @tsparticles/preset-snow

# Optional: shadcn/ui (requires setup)
npx shadcn@latest init
```

## Architecture Patterns

### Recommended Project Structure
```
client/src/
├── components/
│   ├── background/          # Parallax SVG layers
│   │   ├── ParallaxBackground.tsx
│   │   ├── HillsLayer.tsx
│   │   ├── TreesLayer.tsx
│   │   └── CabinLayer.tsx
│   ├── canvas/              # React Flow canvas & nodes
│   │   ├── InfiniteCanvas.tsx
│   │   ├── nodes/
│   │   │   └── SnowballNode.tsx
│   │   └── edges/
│   │       └── FootprintEdge.tsx
│   ├── particles/           # tsparticles snow
│   │   └── SnowParticles.tsx
│   └── overlays/            # HUD, modals, UI chrome
│       └── MainLayout.tsx
├── state/                   # Zustand stores
│   └── canvasStore.ts
├── styles/
│   ├── globals.css          # Tailwind imports, CSS variables
│   └── reactflow.css        # React Flow base styles (import first)
└── App.tsx
```

### Pattern 1: Controlled Canvas with Zustand
**What:** Manage nodes, edges, and viewport in a Zustand store, using React Flow in controlled mode.

**When to use:** Always for this project. Enables cross-component state access, avoids prop drilling, and follows React Flow best practices.

**Example:**
```typescript
// Source: https://reactflow.dev/learn/advanced-use/state-management
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange } from '@xyflow/react';

type CanvasStore = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },
}));
```

### Pattern 2: Custom Node with Memoization
**What:** Create custom React Flow nodes as memoized React components with Tailwind styling.

**When to use:** For all custom node types (snowball nodes in this phase).

**Example:**
```typescript
// Source: https://reactflow.dev/learn/customization/custom-nodes
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export const SnowballNode = memo(({ data, id }: NodeProps) => {
  return (
    <div className="px-4 py-3 rounded-full bg-white shadow-inner shadow-blue-200 border-2 border-slate-100">
      <div className="text-slate-700 font-nunito text-sm">
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

SnowballNode.displayName = 'SnowballNode';

// Register outside component to prevent re-renders
const nodeTypes = { snowball: SnowballNode };

// In ReactFlow component
<ReactFlow nodeTypes={nodeTypes} ... />
```

### Pattern 3: Custom Edge with Dashed Lines
**What:** Create custom edges using BaseEdge helper with SVG styling for dashed/footprint effect.

**When to use:** For footprint-style edges connecting snowball nodes.

**Example:**
```typescript
// Source: https://reactflow.dev/api-reference/types/edge
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export function FootprintEdge({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: '#94a3b8', // slate-400
        strokeWidth: 2,
        strokeDasharray: '8,6', // dashed footprint pattern
        strokeLinecap: 'round',
      }}
    />
  );
}

// Register outside component
const edgeTypes = { footprint: FootprintEdge };
```

### Pattern 4: Pure CSS Parallax Background
**What:** Use CSS 3D transforms with fixed positioning for performant parallax layers.

**When to use:** For background parallax with 3 SVG layers (hills, trees, cabin). Preferred over JavaScript for performance.

**Example:**
```typescript
// Source: https://keithclark.co.uk/articles/pure-css-parallax-websites/
// CSS approach using transform: translateZ() for layers
export function ParallaxBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ perspective: '1px', perspectiveOrigin: 'center top' }}>
      <div className="absolute inset-0" style={{ transform: 'translateZ(-2px) scale(3)' }}>
        <HillsLayer />
      </div>
      <div className="absolute inset-0" style={{ transform: 'translateZ(-1px) scale(2)' }}>
        <TreesLayer />
      </div>
      <div className="absolute inset-0" style={{ transform: 'translateZ(-0.5px) scale(1.5)' }}>
        <CabinLayer />
      </div>
    </div>
  );
}
```

### Pattern 5: framer-motion Scroll-Linked Parallax (Alternative)
**What:** Use framer-motion's useScroll and useTransform for parallax with more control.

**When to use:** If pure CSS doesn't provide enough control, or for complex scroll-driven animations.

**Example:**
```typescript
// Source: https://www.framer.com/motion/scroll-animations/
import { useScroll, useTransform, motion } from 'framer-motion';

export function MotionParallaxLayer({ speed = 0.5, children }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div style={{ y }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}
```

### Pattern 6: Z-Index Layer System
**What:** Define a clear z-index system upfront using CSS custom properties.

**When to use:** Always. Prevents z-index conflicts and makes layering explicit.

**Example:**
```css
/* Source: Research synthesis from CSS layering best practices */
/* globals.css */
:root {
  --z-background: 0;      /* Parallax SVG layers */
  --z-canvas: 10;         /* React Flow canvas */
  --z-particles: 20;      /* tsparticles snow */
  --z-overlay: 30;        /* Modals, dialogs */
  --z-hud: 40;           /* Always-visible UI chrome */
}

.parallax-layer { z-index: var(--z-background); }
.react-flow { z-index: var(--z-canvas); }
.snow-particles { z-index: var(--z-particles); }
```

### Anti-Patterns to Avoid

- **Defining nodeTypes/edgeTypes inside component:** Causes React Flow to re-render on every parent render. Define outside or use `useMemo`.
- **Subscribing to entire nodes/edges array:** Triggers re-renders on every viewport change. Store derived state (like selected IDs) separately.
- **Not memoizing custom nodes:** Without `React.memo`, nodes re-render unnecessarily during pan/zoom operations.
- **Using overflow: hidden on parallax parents:** Breaks CSS parallax effects. Be creative with z-index instead.
- **Complex CSS on many nodes:** Shadows, gradients, and animations impact performance. Simplify styles for large graphs (200+ nodes).
- **Forgetting `nodrag` class on inputs:** Users will drag nodes when trying to interact with form elements.
- **Multiple handles without IDs:** React Flow can't distinguish which handle an edge connects to. Assign unique IDs.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Node graph canvas | Custom pan/zoom/drag logic | @xyflow/react | Handles viewport management, drag-and-drop, connection validation, selection, accessibility, undo/redo, and performance optimizations out-of-the-box |
| Parallax scrolling | Custom scroll listeners + requestAnimationFrame | Pure CSS (3D transforms) or framer-motion | CSS parallax is GPU-accelerated with zero JS cost; framer-motion handles edge cases like scroll boundaries, momentum, and accessibility (prefers-reduced-motion) |
| Particle effects | Canvas particle system from scratch | tsparticles with presets | Snow preset includes density adaptation, boundary handling, performance throttling, and multiple particle behaviors out-of-the-box |
| State management | Context + useReducer or Redux | Zustand | Zustand is what React Flow uses internally, has simpler API, no providers, and better performance for this use case |
| Font loading | Manual @font-face declarations | @fontsource packages | Handles font variants, weights, preloading, and optimization automatically |
| UI components | Custom modal/dialog from scratch | shadcn/ui (Radix UI primitives) | Radix handles accessibility (focus trap, ESC key, aria attributes), portal rendering, and edge cases (nested modals, scroll locking) |

**Key insight:** Node graph libraries like React Flow are deceptively complex. They handle dozens of edge cases: multi-selection, connection validation, z-index sorting, viewport boundaries, touch gestures, accessibility, and more. Building custom costs weeks and results in a buggier product. Similarly, particle systems and parallax have many subtle performance pitfalls that existing solutions solve.

## Common Pitfalls

### Pitfall 1: React Flow Re-Render Loop
**What goes wrong:** Infinite re-render loop or severe performance degradation when interacting with canvas.

**Why it happens:** Defining event handlers, nodeTypes, edgeTypes, or configuration objects inside component render function creates new references every render, which React Flow treats as prop changes.

**How to avoid:**
- Define `nodeTypes` and `edgeTypes` outside component or use `useMemo`
- Use `useCallback` for event handlers (`onNodesChange`, `onConnect`, etc.)
- Use `useMemo` for objects like `defaultEdgeOptions`, `snapGrid`, `defaultViewport`

**Warning signs:** Browser freezes during pan/zoom, DevTools shows thousands of renders, React Flow console warnings about nodeTypes/edgeTypes changing.

**Source:** https://reactflow.dev/learn/advanced-use/performance

### Pitfall 2: Missing Container Dimensions
**What goes wrong:** React Flow renders nothing or renders incorrectly sized canvas.

**Why it happens:** React Flow measures parent container dimensions to render. If parent has no explicit width/height, React Flow can't calculate canvas size.

**How to avoid:**
```css
/* Parent container needs explicit dimensions */
.react-flow-wrapper {
  width: 100vw;
  height: 100vh; /* or specific height */
}
```

**Warning signs:** Empty white space where canvas should be, console warnings about missing dimensions.

**Source:** https://reactflow.dev/learn/troubleshooting/common-errors

### Pitfall 3: Edges Not Rendering After Async Operations
**What goes wrong:** Edges disappear or render in wrong positions after dynamically adding nodes or handles.

**Why it happens:** React Flow caches handle positions internally. When nodes/handles change programmatically, React Flow doesn't automatically recalculate.

**How to avoid:**
```typescript
import { useUpdateNodeInternals } from '@xyflow/react';

const updateNodeInternals = useUpdateNodeInternals();

// After programmatically changing nodes/handles
await addNodeAsync();
updateNodeInternals(nodeId); // Force React Flow to recalculate
```

**Warning signs:** Edges point to wrong locations, edges missing after async updates, edges render but nodes don't.

**Source:** https://reactflow.dev/learn/troubleshooting/common-errors

### Pitfall 4: Multiple Handles Without IDs
**What goes wrong:** Edges connect to wrong handles or don't render at all.

**Why it happens:** When a node has multiple handles of the same type (e.g., two source handles), React Flow can't determine which handle the edge connects to without IDs.

**How to avoid:**
```typescript
// Bad: No IDs on multiple handles
<Handle type="source" position={Position.Bottom} />
<Handle type="source" position={Position.Right} />

// Good: Unique IDs for each handle
<Handle type="source" position={Position.Bottom} id="bottom" />
<Handle type="source" position={Position.Right} id="right" />

// In edge definition
const edge = {
  source: 'node1',
  sourceHandle: 'bottom', // Specify which handle
  target: 'node2',
  targetHandle: 'top'
};
```

**Warning signs:** Edges connect to wrong handle positions, console warnings about handle IDs.

**Source:** https://reactflow.dev/learn/troubleshooting/common-errors

### Pitfall 5: CSS Parallax Breaking with Overflow Hidden
**What goes wrong:** Parallax layers don't scroll at different speeds or disappear entirely.

**Why it happens:** CSS parallax using `translateZ()` transforms requires overflow visible to work. Setting `overflow: hidden` on parallax container or ancestors breaks the 3D effect.

**How to avoid:**
- Don't use `overflow: hidden` on parallax containers
- Use z-index layering to hide content instead
- If overflow clipping is required, use JavaScript parallax with framer-motion instead of pure CSS

**Warning signs:** All layers move at same speed, layers not visible, perspective effects not working.

**Source:** https://keithclark.co.uk/articles/pure-css-parallax-websites/

### Pitfall 6: Parallax Performance Degradation with Large SVGs
**What goes wrong:** Janky scrolling, low frame rates, browser stuttering with parallax background.

**Why it happens:** SVG performance degrades when element count exceeds ~100 shapes. Large, unoptimized SVGs with many paths cause reflows/repaints on every scroll event.

**How to avoid:**
- Simplify SVG artwork (fewer paths, merged shapes)
- Use modern image formats (WebP, AVIF) instead of complex SVGs where possible
- Apply `will-change: transform` to parallax layers (use sparingly)
- Only animate `transform` and `opacity` (GPU-accelerated)
- Consider hybrid: Canvas for complex backgrounds, SVG for interactive elements

**Warning signs:** Scroll feels laggy, DevTools performance profiler shows long paint times, CPU usage spikes during scroll.

**Source:** https://www.augustinfotech.com/blogs/svg-vs-canvas-animation-what-modern-frontends-should-use-in-2026/

### Pitfall 7: Directly Accessing nodes/edges in Components
**What goes wrong:** Components re-render excessively during pan/zoom/drag operations, causing performance issues.

**Why it happens:** React Flow's internal `nodes` and `edges` state changes frequently (every viewport movement, node drag, etc.). Subscribing to entire arrays causes components to re-render on every change.

**How to avoid:**
```typescript
// Bad: Subscribing to entire nodes array
const nodes = useCanvasStore((state) => state.nodes);
const selectedNode = nodes.find(n => n.selected);

// Good: Store derived state separately
const selectedNodeId = useCanvasStore((state) => state.selectedNodeId);
const getNode = useCanvasStore((state) => state.getNode);
const selectedNode = getNode(selectedNodeId);
```

**Warning signs:** UI feels sluggish during canvas interactions, DevTools shows many re-renders, React Profiler shows components rendering frequently.

**Source:** https://reactflow.dev/learn/advanced-use/performance

### Pitfall 8: Missing React Flow Stylesheet Import
**What goes wrong:** Nodes and edges render but look broken: no selection outline, no connection previews, missing handles.

**Why it happens:** React Flow requires its base stylesheet to be imported. Without it, only custom styles apply.

**How to avoid:**
```typescript
// Import React Flow base styles BEFORE Tailwind/custom styles
import '@xyflow/react/dist/style.css';
import './globals.css'; // Tailwind and custom styles after
```

**Warning signs:** Nodes render but look unstyled, handles invisible, selection doesn't show visually.

**Source:** https://reactflow.dev/learn/troubleshooting/common-errors

## Code Examples

Verified patterns from official sources:

### Setting Up Vite + React + TypeScript Project
```bash
# Source: https://vite.dev/guide/
npm create vite@latest tidalhack-client -- --template react-ts
cd tidalhack-client
npm install
npm run dev
```

### React Flow Canvas Component with Zustand
```typescript
// Source: https://reactflow.dev/learn/advanced-use/state-management
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '../state/canvasStore';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

export function InfiniteCanvas() {
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.2}
        maxZoom={3}
      >
        <Background color="#1e293b" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

### tsParticles Snow Effect Setup
```typescript
// Source: https://www.npmjs.com/package/@tsparticles/preset-snow
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSnowPreset } from '@tsparticles/preset-snow';
import type { Engine } from '@tsparticles/engine';

export function SnowParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSnowPreset(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: 'snow',
        background: { color: 'transparent' },
        particles: {
          number: { density: { enable: true, area: 800 }, value: 80 },
          size: { value: { min: 1, max: 5 } },
          move: { speed: 1, direction: 'bottom' },
        },
      }}
    />
  );
}
```

### Tailwind CSS Configuration for Custom Design System
```javascript
// tailwind.config.js
// Source: Tailwind CSS documentation + React Flow theming
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Moody navy-to-slate palette
        background: {
          dark: '#0f172a',   // slate-900
          light: '#1e293b',  // slate-800
        },
        accent: {
          warm: '#f59e0b',   // amber-500
          heat: '#f97316',   // orange-500
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      zIndex: {
        background: '0',
        canvas: '10',
        particles: '20',
        overlay: '30',
        hud: '40',
      },
    },
  },
  plugins: [],
};
```

### Self-Hosting Google Fonts with @fontsource
```typescript
// Source: https://fontsource.org/
// main.tsx or App.tsx
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';

// Then use in Tailwind config fontFamily (see above)
```

### Express + MongoDB Caching Setup (Backend)
```typescript
// Source: https://medium.com/@techsuneel99/optimizing-performance-with-database-caching-in-node-js-23ddbb583176
// server/src/middleware/cache.ts
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

export async function cacheMiddleware(req, res, next) {
  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Intercept res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redisClient.setEx(key, 30, JSON.stringify(data)); // 30s TTL
      return originalJson(data);
    };

    next();
  } catch (error) {
    next(); // Fail gracefully if Redis unavailable
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App (CRA) | Vite 5+ | Feb 2025 (CRA deprecated) | Faster dev experience, instant startup, better DX |
| react-flow-renderer | @xyflow/react | React Flow 12 (2024) | New package name, improved types, better tree-shaking |
| JavaScript parallax libraries | Pure CSS 3D transforms or framer-motion | 2024-2025 | Better performance (GPU-accelerated), accessibility support |
| Zustand v3 | Zustand v4 | 2023 | Simplified API, better TypeScript support |
| Tailwind CSS 2.x | Tailwind CSS 3.x/4.x | v3: 2021, v4: 2025 | Smaller bundle, better JIT, native CSS cascade layers (v4) |
| Manual font loading | @fontsource packages | 2023-2024 | Self-hosted fonts for privacy, performance, reliability |
| Redux for simple state | Zustand/Jotai | 2022-2024 | Less boilerplate, better DX for smaller apps |

**Deprecated/outdated:**
- **Create React App (CRA):** Officially deprecated Feb 2025, replaced by Vite, Next.js, Remix
- **react-flow-renderer package:** Renamed to @xyflow/react in v12, old package no longer maintained
- **JavaScript scroll listeners for parallax:** Replaced by CSS or framer-motion for performance and accessibility
- **Global CSS for React Flow styling:** Use CSS modules or Tailwind to avoid conflicts

## Open Questions

1. **Parallax implementation choice: Pure CSS vs framer-motion?**
   - What we know: Pure CSS is more performant (GPU-accelerated, zero JS), framer-motion offers more control and easier scroll-linked animations
   - What's unclear: Does pure CSS parallax work well with React Flow's viewport transforms? Will scroll behavior conflict?
   - Recommendation: Start with pure CSS parallax for background layers (fixed positioning, independent of canvas). If conflicts arise or more control needed, migrate to framer-motion's `useScroll` + `useTransform`. Test both approaches during implementation.

2. **Viewport culling: Use onlyRenderVisibleElements prop?**
   - What we know: React Flow has `onlyRenderVisibleElements` prop for viewport culling. Maintainers warn it can worsen performance on small/medium graphs but helps on very large graphs (500+ nodes).
   - What's unclear: At what node count does it become beneficial? Phase 1 likely has <100 nodes.
   - Recommendation: Don't use initially. Add performance testing with 200+ nodes in later phase and enable if needed. Prioritize memoization first.

3. **Redis for MongoDB caching: Overkill for hackathon?**
   - What we know: Redis significantly improves API response times (30-50ms → 10-15ms). Standard pattern for Express + MongoDB.
   - What's unclear: Is complexity worth it for a hackathon project with limited time? Judges may never see performance difference.
   - Recommendation: Skip Redis initially. Use in-memory caching (Map/LRU cache) in Express if caching needed. Only add Redis if backend performance becomes issue or if extra time available.

4. **shadcn/ui: Worth setup time for Phase 1?**
   - What we know: shadcn/ui provides copy-paste accessible components (modals, dialogs). Requires setup time. Phase 1 focuses on canvas/atmosphere, not complex UI.
   - What's unclear: Will we need modals/dialogs in Phase 1? Is setup time justified?
   - Recommendation: Skip shadcn/ui in Phase 1. Use plain Tailwind for simple UI. Add shadcn/ui in later phases if complex UI components (modals, forms) are needed.

## Sources

### Primary (HIGH confidence)
- React Flow State Management: https://reactflow.dev/learn/advanced-use/state-management
- React Flow Custom Nodes: https://reactflow.dev/learn/customization/custom-nodes
- React Flow API Reference: https://reactflow.dev/api-reference/react-flow
- React Flow Performance Guide: https://reactflow.dev/learn/advanced-use/performance
- React Flow Common Errors: https://reactflow.dev/learn/troubleshooting/common-errors
- React Flow Edge Types: https://reactflow.dev/api-reference/types/edge
- Vite Getting Started: https://vite.dev/guide/
- Pure CSS Parallax by Keith Clark: https://keithclark.co.uk/articles/pure-css-parallax-websites/
- framer-motion Scroll Animations: https://www.framer.com/motion/scroll-animations/
- tsParticles Snow Preset: https://www.npmjs.com/package/@tsparticles/preset-snow
- shadcn/ui Documentation: https://ui.shadcn.com/docs/installation/vite
- Tailwind CSS with React Flow: https://reactflow.dev/examples/styling/tailwind

### Secondary (MEDIUM confidence)
- [React Flow Performance Optimization Guide](https://medium.com/@lukasz.jazwa_32493/the-ultimate-guide-to-optimize-react-flow-project-performance-42f4297b2b7b) - Verified with official docs
- [Vite 2026 Guide](https://medium.com/@shubhspatil77/stop-waiting-for-your-react-app-to-load-the-2026-guide-to-vite-7e071923ab9f) - Verified with official Vite docs
- [Express MongoDB Caching](https://medium.com/@techsuneel99/optimizing-performance-with-database-caching-in-node-js-23ddbb583176) - Standard pattern, verified with Redis docs
- [SVG vs Canvas Animation 2026](https://www.augustinfotech.com/blogs/svg-vs-canvas-animation-what-modern-frontends-should-use-in-2026/) - Performance claims verified with MDN
- [Parallax Scrolling 2026](https://www.webbb.ai/blog/parallax-scrolling-still-cool-in-2026) - Design trends, multiple source agreement
- [React Flow Migration Guide](https://reactflow.dev/learn/troubleshooting/migrate-to-v12) - Official migration docs

### Tertiary (LOW confidence)
- Various blog posts and DEV Community articles - Used for ecosystem discovery, all claims verified against official docs before inclusion

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - All libraries verified via official docs and npm, versions confirmed, React Flow and Vite are industry standard
- Architecture patterns: **HIGH** - All patterns sourced from official React Flow docs, pure CSS parallax from authoritative Keith Clark article, Zustand patterns from official docs
- Performance optimization: **HIGH** - Directly from React Flow official performance guide and troubleshooting docs
- Pitfalls: **HIGH** - All pitfalls documented in official React Flow troubleshooting, with additional verified performance sources
- Parallax implementation details: **MEDIUM** - CSS parallax from authoritative source but React Flow + CSS parallax interaction not officially documented (marked as Open Question)
- Backend caching patterns: **MEDIUM** - Standard Express + MongoDB + Redis pattern from multiple sources, but not React Flow specific

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - relatively stable ecosystem, but React/Vite move fast)

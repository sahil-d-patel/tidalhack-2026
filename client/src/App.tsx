import { ParallaxBackground } from './components/background/ParallaxBackground'
import InfiniteCanvas from './components/canvas/InfiniteCanvas'

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background-dark">
      {/* Layer 0: Background */}
      <ParallaxBackground />

      {/* Layer 10: Canvas */}
      <InfiniteCanvas />

      {/* Layer 40: HUD overlay */}
      <div
        className="fixed top-8 left-8 pointer-events-none"
        style={{ zIndex: 'var(--z-hud)' }}
      >
        <h1 className="text-2xl font-heading font-bold text-accent-warm/80 drop-shadow-lg">
          FRACTAL
        </h1>
        <p className="text-xs font-body text-frost/40">
          Interactive Branching Music Creation
        </p>
      </div>
    </div>
  )
}

export default App

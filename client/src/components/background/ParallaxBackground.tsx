import { SkyLayer } from './HillsLayer';
import { NeighborhoodLayer } from './TreesLayer';
import { GroundLayer } from './CabinLayer';
import { useCanvasStore } from '../../state/canvasStore';

export function ParallaxBackground() {
  const gameMode = useCanvasStore((state) => state.gameMode);
  const isDayMode = useCanvasStore((state) => state.isDayMode);
  const isBlizzard = gameMode === 'blizzard';

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 'var(--z-background)',
        perspective: '1px',
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Sky gradient base - rich layered gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: isBlizzard
            ? 'linear-gradient(to bottom, #040610, #0a0e20)'
            : isDayMode
              ? 'linear-gradient(to bottom, #4a90d9, #87CEEB, #b8dff0)'
              : 'linear-gradient(to bottom, #0a0a1a 0%, #0f1428 15%, #1a1a3a 30%, #252550 50%, #3a3065 70%, #4a3a70 85%, #2a2545 100%)',
          transition: 'all 1s ease-in-out',
        }}
      />

      {/* Sky layer - stars/sun, moon/sun, clouds (furthest back) */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-2px) scale(3)',
          transformStyle: 'preserve-3d',
          opacity: isBlizzard ? 0.3 : 1,
          transition: 'opacity 1.5s ease-in-out',
        }}
      >
        <SkyLayer isDayMode={isDayMode} />
      </div>

      {/* Neighborhood layer - houses + solid ground (middle depth) */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-1px) scale(2)',
          transformStyle: 'preserve-3d',
          opacity: isBlizzard ? 0.15 : 1,
          transition: 'opacity 1.5s ease-in-out',
        }}
      >
        <NeighborhoodLayer isDayMode={isDayMode} />
      </div>

      {/* Ground layer - foreground campfire, snow details (nearest) */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-0.5px) scale(1.5)',
          transformStyle: 'preserve-3d',
          opacity: isBlizzard ? 0.2 : 1,
          transition: 'opacity 1.5s ease-in-out',
        }}
      >
        <GroundLayer isDayMode={isDayMode} />
      </div>
    </div>
  );
}

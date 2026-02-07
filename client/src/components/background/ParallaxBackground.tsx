import { HillsLayer } from './HillsLayer';
import { TreesLayer } from './TreesLayer';
import { CabinLayer } from './CabinLayer';

export function ParallaxBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 'var(--z-background)',
        perspective: '1px',
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Sky gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark to-background" />

      {/* Hills layer - furthest back */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-2px) scale(3)',
          transformStyle: 'preserve-3d',
        }}
      >
        <HillsLayer />
      </div>

      {/* Trees layer - middle depth */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-1px) scale(2)',
          transformStyle: 'preserve-3d',
        }}
      >
        <TreesLayer />
      </div>

      {/* Cabin layer - nearest */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translateZ(-0.5px) scale(1.5)',
          transformStyle: 'preserve-3d',
        }}
      >
        <CabinLayer />
      </div>
    </div>
  );
}

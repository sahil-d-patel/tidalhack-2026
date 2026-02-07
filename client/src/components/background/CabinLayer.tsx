export function CabinLayer() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes smokeRise {
            0% {
              transform: translate(0, 0);
              opacity: 0.6;
            }
            50% {
              transform: translate(3px, -30px);
              opacity: 0.3;
            }
            100% {
              transform: translate(-2px, -60px);
              opacity: 0;
            }
          }

          .smoke {
            animation: smokeRise 4s ease-in-out infinite;
          }

          .smoke:nth-child(2) {
            animation-delay: 1.3s;
          }

          .smoke:nth-child(3) {
            animation-delay: 2.6s;
          }
        `}</style>

        {/* Warm glow radial gradient for windows */}
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cabin positioned bottom-right */}
      <g transform="translate(1400, 880)">
        {/* Ambient glow behind cabin */}
        <circle cx="60" cy="30" r="80" fill="url(#windowGlow)" />

        {/* Cabin body */}
        <rect x="0" y="0" width="120" height="80" fill="#475569" />

        {/* Roof */}
        <polygon points="60,-40 -10,0 130,0" fill="#334155" />

        {/* Chimney */}
        <rect x="85" y="-30" width="15" height="30" fill="#1e293b" />

        {/* Chimney smoke particles */}
        <g className="smoke-container">
          <ellipse className="smoke" cx="92" cy="-35" rx="8" ry="6" fill="#94a3b8" opacity="0.6" />
          <ellipse className="smoke" cx="92" cy="-35" rx="7" ry="5" fill="#94a3b8" opacity="0.5" />
          <ellipse className="smoke" cx="92" cy="-35" rx="6" ry="5" fill="#94a3b8" opacity="0.4" />
        </g>

        {/* Left window */}
        <rect x="20" y="30" width="25" height="30" fill="#fbbf24" />

        {/* Right window */}
        <rect x="75" y="30" width="25" height="30" fill="#fbbf24" />

        {/* Window glow effect (subtle) */}
        <rect x="20" y="30" width="25" height="30" fill="#f59e0b" opacity="0.3" />
        <rect x="75" y="30" width="25" height="30" fill="#f59e0b" opacity="0.3" />

        {/* Door */}
        <rect x="48" y="45" width="24" height="35" fill="#1e293b" />

        {/* Door window (small amber glow) */}
        <rect x="56" y="52" width="8" height="10" fill="#fbbf24" opacity="0.6" />
      </g>
    </svg>
  );
}

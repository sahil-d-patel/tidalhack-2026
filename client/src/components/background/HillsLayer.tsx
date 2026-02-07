export function HillsLayer() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="hillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="1920" height="1080" fill="url(#skyGradient)" />

      {/* Rolling hills - furthest back */}
      <path
        d="M 0 700 Q 480 600 960 650 T 1920 700 L 1920 1080 L 0 1080 Z"
        fill="#1e293b"
        opacity="0.6"
      />

      {/* Middle hills */}
      <path
        d="M 0 750 Q 400 680 800 720 Q 1200 760 1600 700 Q 1760 680 1920 720 L 1920 1080 L 0 1080 Z"
        fill="url(#hillGradient)"
        opacity="0.8"
      />

      {/* Nearest hills */}
      <path
        d="M 0 820 Q 320 760 640 800 Q 960 840 1280 790 Q 1600 740 1920 800 L 1920 1080 L 0 1080 Z"
        fill="#334155"
      />
    </svg>
  );
}

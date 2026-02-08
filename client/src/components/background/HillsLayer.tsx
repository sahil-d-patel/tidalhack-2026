type SkyLayerProps = { isDayMode: boolean }

export function SkyLayer({ isDayMode }: SkyLayerProps) {
  const stars = [
    { cx: 120, cy: 80, r: 1.2, opacity: 0.8, delay: 0 },
    { cx: 280, cy: 45, r: 0.8, opacity: 0.5, delay: 1.2 },
    { cx: 410, cy: 120, r: 1.0, opacity: 0.7, delay: 2.5 },
    { cx: 530, cy: 30, r: 1.4, opacity: 0.9, delay: 0.8 },
    { cx: 650, cy: 95, r: 0.7, opacity: 0.4, delay: 3.1 },
    { cx: 780, cy: 55, r: 1.1, opacity: 0.6, delay: 1.7 },
    { cx: 890, cy: 140, r: 0.9, opacity: 0.5, delay: 4.0 },
    { cx: 1020, cy: 35, r: 1.3, opacity: 0.8, delay: 0.3 },
    { cx: 1150, cy: 110, r: 0.8, opacity: 0.6, delay: 2.2 },
    { cx: 1280, cy: 60, r: 1.0, opacity: 0.7, delay: 1.5 },
    { cx: 1400, cy: 25, r: 0.6, opacity: 0.4, delay: 3.6 },
    { cx: 1520, cy: 100, r: 1.2, opacity: 0.8, delay: 0.9 },
    { cx: 1650, cy: 70, r: 0.9, opacity: 0.5, delay: 2.8 },
    { cx: 1780, cy: 130, r: 1.1, opacity: 0.7, delay: 1.1 },
    { cx: 1860, cy: 40, r: 0.7, opacity: 0.6, delay: 3.4 },
    { cx: 200, cy: 200, r: 1.0, opacity: 0.5, delay: 4.2 },
    { cx: 350, cy: 250, r: 0.8, opacity: 0.4, delay: 0.6 },
    { cx: 500, cy: 180, r: 1.3, opacity: 0.7, delay: 2.0 },
    { cx: 720, cy: 220, r: 0.6, opacity: 0.3, delay: 3.8 },
    { cx: 960, cy: 190, r: 1.1, opacity: 0.6, delay: 1.4 },
    { cx: 1100, cy: 240, r: 0.9, opacity: 0.5, delay: 2.6 },
    { cx: 1300, cy: 170, r: 1.0, opacity: 0.8, delay: 0.2 },
    { cx: 1500, cy: 210, r: 0.7, opacity: 0.4, delay: 3.2 },
    { cx: 1700, cy: 260, r: 1.2, opacity: 0.6, delay: 1.9 },
    { cx: 160, cy: 310, r: 0.8, opacity: 0.3, delay: 4.5 },
    { cx: 440, cy: 330, r: 1.0, opacity: 0.5, delay: 0.7 },
    { cx: 680, cy: 290, r: 0.6, opacity: 0.4, delay: 2.3 },
    { cx: 850, cy: 350, r: 1.1, opacity: 0.6, delay: 1.0 },
    { cx: 1050, cy: 300, r: 0.9, opacity: 0.5, delay: 3.5 },
    { cx: 1250, cy: 340, r: 0.7, opacity: 0.3, delay: 2.1 },
    { cx: 1450, cy: 280, r: 1.3, opacity: 0.7, delay: 0.4 },
    { cx: 1650, cy: 320, r: 0.8, opacity: 0.5, delay: 3.9 },
    { cx: 1820, cy: 290, r: 1.0, opacity: 0.6, delay: 1.6 },
    { cx: 90, cy: 400, r: 0.7, opacity: 0.3, delay: 2.9 },
    { cx: 320, cy: 420, r: 1.1, opacity: 0.4, delay: 0.5 },
    { cx: 570, cy: 380, r: 0.8, opacity: 0.5, delay: 3.3 },
    { cx: 810, cy: 440, r: 0.6, opacity: 0.3, delay: 1.8 },
    { cx: 1180, cy: 390, r: 1.0, opacity: 0.4, delay: 4.1 },
    { cx: 1380, cy: 410, r: 0.9, opacity: 0.5, delay: 2.4 },
    { cx: 1580, cy: 370, r: 0.7, opacity: 0.3, delay: 0.1 },
  ]

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: 'all 1s ease-in-out' }}
    >
      <defs>
        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f0cd" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#e8dfa0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e8dfa0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonSurface" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#faf6e3" />
          <stop offset="60%" stopColor="#f0ead0" />
          <stop offset="100%" stopColor="#e5dcb5" />
        </radialGradient>

        {/* Sun glow */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7cc" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#fde68a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunSurface" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fcd34d" />
        </radialGradient>

        <filter id="starGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="celestialHalo" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="sunHalo" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Atmospheric glow near horizon - adapts to mode */}
      {!isDayMode && (
        <>
          <ellipse cx="960" cy="750" rx="1200" ry="300" fill="#2d1f5e" opacity="0.15" />
          <ellipse cx="600" cy="800" rx="800" ry="200" fill="#1e3a5f" opacity="0.08" />
        </>
      )}

      {/* === CELESTIAL BODY === */}
      {isDayMode ? (
        /* Sun */
        <>
          <circle cx="1580" cy="150" r="160" fill="#fef3c7" opacity="0.06" filter="url(#sunHalo)" />
          <circle cx="1580" cy="150" r="100" fill="url(#sunGlow)" />
          <circle cx="1580" cy="150" r="48" fill="url(#sunSurface)" />
          <circle cx="1580" cy="150" r="48" fill="none" stroke="#fef9c3" strokeWidth="1" opacity="0.5" />
          {/* Sun rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1={1580 + Math.cos((angle * Math.PI) / 180) * 55}
              y1={150 + Math.sin((angle * Math.PI) / 180) * 55}
              x2={1580 + Math.cos((angle * Math.PI) / 180) * 72}
              y2={150 + Math.sin((angle * Math.PI) / 180) * 72}
              stroke="#fcd34d"
              strokeWidth="2"
              opacity="0.4"
              strokeLinecap="round"
            />
          ))}
        </>
      ) : (
        /* Moon */
        <>
          <circle cx="1580" cy="150" r="120" fill="#f5f0cd" opacity="0.06" filter="url(#celestialHalo)" />
          <circle cx="1580" cy="150" r="90" fill="url(#moonGlow)" />
          <circle cx="1580" cy="150" r="42" fill="url(#moonSurface)" />
          <circle cx="1570" cy="140" r="6" fill="#ddd5a8" opacity="0.3" />
          <circle cx="1592" cy="160" r="4" fill="#ddd5a8" opacity="0.25" />
          <circle cx="1575" cy="168" r="3" fill="#ddd5a8" opacity="0.2" />
          <circle cx="1560" cy="155" r="2.5" fill="#ddd5a8" opacity="0.15" />
          <circle cx="1595" cy="138" r="3.5" fill="#ddd5a8" opacity="0.2" />
          <circle cx="1580" cy="150" r="42" fill="none" stroke="#faf6e3" strokeWidth="0.5" opacity="0.4" />
        </>
      )}

      {/* Stars - only visible at night */}
      {!isDayMode && stars.map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#ffffff"
          opacity={star.opacity}
          filter="url(#starGlow)"
          className="animate-twinkle"
          style={{ animationDelay: `${star.delay}s`, '--star-opacity': star.opacity } as React.CSSProperties}
        />
      ))}

      {/* Clouds - brighter in day, subtle at night */}
      <g className="animate-drift-slow" opacity={isDayMode ? 0.5 : 0.06}>
        <ellipse cx="300" cy="200" rx="120" ry="35" fill="white" />
        <ellipse cx="350" cy="190" rx="80" ry="30" fill="white" />
        <ellipse cx="260" cy="195" rx="60" ry="25" fill="white" />
        <ellipse cx="320" cy="210" rx="90" ry="25" fill="white" />
      </g>

      <g className="animate-drift-medium" opacity={isDayMode ? 0.4 : 0.05}>
        <ellipse cx="800" cy="120" rx="100" ry="28" fill="white" />
        <ellipse cx="840" cy="110" rx="70" ry="24" fill="white" />
        <ellipse cx="770" cy="115" rx="50" ry="20" fill="white" />
      </g>

      <g className="animate-drift-slow" style={{ animationDelay: '15s' }} opacity={isDayMode ? 0.35 : 0.04}>
        <ellipse cx="1200" cy="250" rx="80" ry="20" fill="white" />
        <ellipse cx="1230" cy="243" rx="55" ry="18" fill="white" />
        <ellipse cx="1180" cy="246" rx="40" ry="15" fill="white" />
      </g>

      <g className="animate-drift-medium" style={{ animationDelay: '30s' }} opacity={isDayMode ? 0.3 : 0.035}>
        <ellipse cx="1500" cy="280" rx="110" ry="25" fill="white" />
        <ellipse cx="1540" cy="272" rx="75" ry="22" fill="white" />
        <ellipse cx="1470" cy="275" rx="55" ry="18" fill="white" />
      </g>
    </svg>
  )
}

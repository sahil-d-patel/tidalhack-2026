type NeighborhoodLayerProps = { isDayMode: boolean }

export function NeighborhoodLayer({ isDayMode }: NeighborhoodLayerProps) {
  // Day/night adaptive colors
  const c = isDayMode ? {
    body: '#8b9dc3',
    bodyAlt: '#7a8db5',
    bodyDark: '#6b7ea8',
    roof: '#6b7a9a',
    roofDark: '#5a6a8a',
    door: '#4a5a7a',
    snow: '#e8eef5',
    ground: '#d0dae8',
    groundDark: '#b8c8d8',
    window: '#a8c8e8',  // blue-grey reflections in day
    windowAlt: '#90b8d8',
    chimney: '#5a6a8a',
    tree: '#6a8a6a',
    treeTrunk: '#5a6a5a',
    fence: '#7a8db5',
    lampOff: '#7a8db5',
  } : {
    body: '#2a2545',
    bodyAlt: '#252040',
    bodyDark: '#28233f',
    roof: '#1e1a38',
    roofDark: '#1c1735',
    door: '#1a1530',
    snow: '#d4dae8',
    ground: '#1a1835',
    groundDark: '#151230',
    window: '#fbbf24',
    windowAlt: '#fbbf24',
    chimney: '#1a1530',
    tree: '#1e2a3a',
    treeTrunk: '#1a1530',
    fence: '#2a2545',
    lampOff: '#2a2545',
  }

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
            0% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(3px, -25px); opacity: 0.25; }
            100% { transform: translate(-2px, -50px); opacity: 0; }
          }
          .smoke { animation: smokeRise 5s ease-in-out infinite; }
          .smoke-d1 { animation-delay: 1.5s; }
          .smoke-d2 { animation-delay: 3s; }
        `}</style>
        <radialGradient id="winGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lampGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === SOLID GROUND - ensures houses sit on solid base === */}
      <rect x="0" y="810" width="1920" height="270" fill={c.ground} />
      <path
        d="M 0 810 Q 300 800 600 808 Q 900 818 1200 805 Q 1500 798 1920 810 L 1920 830 Q 1500 818 1200 825 Q 900 838 600 828 Q 300 820 0 830 Z"
        fill={c.snow}
        opacity="0.3"
      />

      {/* === House 1: Small cottage === */}
      <g transform="translate(80, 730)">
        <rect x="0" y="20" width="90" height="60" fill={c.body} />
        <polygon points="45,-15 -8,20 98,20" fill={c.roof} />
        <path d="M 45,-15 Q 20,2 -8,20 L 98,20 Q 70,2 45,-15" fill={c.snow} opacity="0.5" />
        <rect x="25" y="40" width="18" height="22" rx="1" fill={c.window} opacity={isDayMode ? 0.6 : 0.85} />
        <rect x="47" y="40" width="18" height="22" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.7} />
        {!isDayMode && <circle cx="40" cy="51" r="25" fill="url(#winGlow)" />}
        <rect x="34" y="58" width="22" height="22" rx="1" fill={c.door} />
        <circle cx="52" cy="70" r="1.5" fill="#fbbf24" opacity="0.4" />
      </g>

      {/* === Bare winter tree === */}
      <g transform="translate(210, 770)">
        <line x1="0" y1="0" x2="0" y2="40" stroke={c.fence} strokeWidth="4" />
        <line x1="0" y1="5" x2="-18" y2="-18" stroke={c.fence} strokeWidth="2.5" />
        <line x1="-18" y1="-18" x2="-28" y2="-28" stroke={c.fence} strokeWidth="1.5" />
        <line x1="-18" y1="-18" x2="-10" y2="-32" stroke={c.fence} strokeWidth="1.5" />
        <line x1="0" y1="10" x2="20" y2="-12" stroke={c.fence} strokeWidth="2.5" />
        <line x1="20" y1="-12" x2="15" y2="-30" stroke={c.fence} strokeWidth="1.5" />
        <line x1="20" y1="-12" x2="32" y2="-24" stroke={c.fence} strokeWidth="1.5" />
      </g>

      {/* === House 2: Tall narrow house === */}
      <g transform="translate(280, 710)">
        <rect x="0" y="0" width="70" height="100" fill={c.bodyAlt} />
        <polygon points="35,-40 -6,0 76,0" fill={c.roofDark} />
        <path d="M 35,-40 Q 15,-22 -6,0 L 76,0 Q 55,-22 35,-40" fill={c.snow} opacity="0.45" />
        <rect x="52" y="-30" width="12" height="30" fill={c.chimney} />
        <rect x="50" y="-33" width="16" height="4" rx="1" fill={c.chimney} />
        <ellipse cx="58" cy="-33" rx="10" ry="3" fill={c.snow} opacity="0.5" />
        {!isDayMode && (
          <>
            <ellipse className="smoke" cx="58" cy="-37" rx="6" ry="4" fill="#8090b0" opacity="0.4" />
            <ellipse className="smoke smoke-d1" cx="58" cy="-37" rx="5" ry="3.5" fill="#8090b0" opacity="0.3" />
          </>
        )}
        <rect x="15" y="18" width="16" height="18" rx="1" fill={c.window} opacity={isDayMode ? 0.5 : 0.8} />
        <rect x="39" y="18" width="16" height="18" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.45 : 0.65} />
        <rect x="15" y="55" width="16" height="18" rx="1" fill={c.window} opacity={isDayMode ? 0.5 : 0.75} />
        <rect x="39" y="55" width="16" height="18" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.45 : 0.55} />
        {!isDayMode && <circle cx="35" cy="45" r="30" fill="url(#winGlow)" />}
        <rect x="22" y="78" width="26" height="22" rx="2" fill={c.door} />
      </g>

      {/* === Lamppost 1 === */}
      <g transform="translate(420, 760)">
        <rect x="-2" y="0" width="4" height="50" rx="1" fill={c.lampOff} />
        <rect x="-8" y="-5" width="16" height="8" rx="3" fill={c.lampOff} />
        <circle cx="0" cy="-2" r="4" fill={isDayMode ? '#e0e0e0' : '#fcd34d'} opacity={isDayMode ? 0.6 : 0.9} />
        {!isDayMode && <circle cx="0" cy="10" r="35" fill="url(#lampGlow)" className="animate-lamp-glow" />}
      </g>

      {/* === House 3: Wide cozy house === */}
      <g transform="translate(480, 735)">
        <rect x="0" y="0" width="130" height="75" fill={c.bodyDark} />
        <polygon points="65,-33 -10,0 140,0" fill={c.roof} />
        <path d="M 65,-33 Q 30,-18 -10,0 L 140,0 Q 100,-18 65,-33" fill={c.snow} opacity="0.45" />
        <rect x="105" y="-25" width="14" height="25" fill={c.chimney} />
        <ellipse cx="112" cy="-25" rx="9" ry="3" fill={c.snow} opacity="0.5" />
        {!isDayMode && (
          <>
            <ellipse className="smoke" cx="112" cy="-29" rx="6" ry="4" fill="#8090b0" opacity="0.35" />
            <ellipse className="smoke smoke-d1" cx="112" cy="-29" rx="5" ry="3" fill="#8090b0" opacity="0.25" />
          </>
        )}
        <rect x="15" y="17" width="35" height="28" rx="1" fill={c.window} opacity={isDayMode ? 0.55 : 0.8} />
        <line x1="27" y1="17" x2="27" y2="45" stroke={c.bodyDark} strokeWidth="2" />
        <line x1="39" y1="17" x2="39" y2="45" stroke={c.bodyDark} strokeWidth="2" />
        <rect x="80" y="20" width="20" height="22" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.65} />
        {!isDayMode && <circle cx="50" cy="35" r="40" fill="url(#winGlow)" />}
        <rect x="55" y="47" width="24" height="28" rx="2" fill={c.door} />
        <circle cx="75" cy="62" r="1.5" fill="#fbbf24" opacity="0.4" />
        {/* Fence */}
        <g transform="translate(-25, 50)">
          {[0, 12, 24, 36].map((x) => (
            <rect key={x} x={x} y="0" width="3" height="18" rx="0.5" fill={c.fence} opacity="0.6" />
          ))}
          <rect x="0" y="5" width="39" height="2" rx="0.5" fill={c.fence} opacity="0.5" />
          <rect x="0" y="12" width="39" height="2" rx="0.5" fill={c.fence} opacity="0.5" />
        </g>
      </g>

      {/* === Bare tree 2 === */}
      <g transform="translate(660, 755)">
        <line x1="0" y1="0" x2="0" y2="55" stroke={c.fence} strokeWidth="5" />
        <line x1="0" y1="5" x2="-22" y2="-22" stroke={c.fence} strokeWidth="3" />
        <line x1="-22" y1="-22" x2="-35" y2="-34" stroke={c.fence} strokeWidth="1.8" />
        <line x1="0" y1="10" x2="25" y2="-18" stroke={c.fence} strokeWidth="3" />
        <line x1="25" y1="-18" x2="38" y2="-30" stroke={c.fence} strokeWidth="1.5" />
        <line x1="0" y1="20" x2="-12" y2="3" stroke={c.fence} strokeWidth="2.2" />
      </g>

      {/* === Lamppost 2 === */}
      <g transform="translate(750, 760)">
        <rect x="-2" y="0" width="4" height="50" rx="1" fill={c.lampOff} />
        <rect x="-8" y="-5" width="16" height="8" rx="3" fill={c.lampOff} />
        <circle cx="0" cy="-2" r="4" fill={isDayMode ? '#e0e0e0' : '#fcd34d'} opacity={isDayMode ? 0.6 : 0.9} />
        {!isDayMode && <circle cx="0" cy="10" r="35" fill="url(#lampGlow)" className="animate-lamp-glow" />}
      </g>

      {/* === House 4: Two-story Victorian === */}
      <g transform="translate(800, 690)">
        <rect x="0" y="0" width="100" height="120" fill={c.bodyAlt} />
        <polygon points="50,-45 -8,0 108,0" fill={c.roofDark} />
        <path d="M 50,-45 Q 22,-25 -8,0 L 108,0 Q 78,-25 50,-45" fill={c.snow} opacity="0.4" />
        <circle cx="50" cy="-18" r="10" fill={c.window} opacity={isDayMode ? 0.4 : 0.5} />
        <line x1="50" y1="-28" x2="50" y2="-8" stroke={c.bodyAlt} strokeWidth="2" />
        <line x1="40" y1="-18" x2="60" y2="-18" stroke={c.bodyAlt} strokeWidth="2" />
        <rect x="15" y="15" width="18" height="22" rx="1" fill={c.window} opacity={isDayMode ? 0.5 : 0.75} />
        <rect x="67" y="15" width="18" height="22" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.45 : 0.6} />
        <rect x="10" y="65" width="22" height="25" rx="1" fill={c.window} opacity={isDayMode ? 0.55 : 0.8} />
        <rect x="68" y="65" width="22" height="25" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.7} />
        {!isDayMode && <circle cx="50" cy="60" r="45" fill="url(#winGlow)" />}
        <rect x="38" y="93" width="24" height="27" rx="2" fill={c.door} />
        <ellipse cx="50" cy="93" rx="12" ry="6" fill={c.door} />
        <rect x="33" y="120" width="34" height="4" rx="1" fill={c.bodyDark} />
      </g>

      {/* === House 5: Small bungalow === */}
      <g transform="translate(1000, 742)">
        <rect x="0" y="0" width="80" height="68" fill={c.body} />
        <polygon points="40,-26 -6,0 86,0" fill={c.roof} />
        <path d="M 40,-26 Q 18,-15 -6,0 L 86,0 Q 62,-15 40,-26" fill={c.snow} opacity="0.45" />
        <rect x="12" y="14" width="16" height="18" rx="1" fill={c.window} opacity={isDayMode ? 0.55 : 0.8} />
        <rect x="52" y="14" width="16" height="18" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.65} />
        {!isDayMode && <circle cx="40" cy="24" r="28" fill="url(#winGlow)" />}
        <rect x="32" y="38" width="18" height="30" rx="1" fill={c.door} />
      </g>

      {/* === Evergreen tree (snowy) === */}
      <g transform="translate(1120, 750)">
        <polygon points="0,-55 -18,-10 -12,-10 -25,20 -15,20 -30,50 30,50 15,20 25,20 12,-10 18,-10" fill={c.tree} />
        <path d="M 0,-55 L 10,-30 L -5,-28 Z" fill={c.snow} opacity="0.5" />
        <path d="M -12,-10 L 5,-8 L -15,5 Z" fill={c.snow} opacity="0.4" />
        <path d="M 12,-10 L 20,5 L 5,2 Z" fill={c.snow} opacity="0.35" />
        <rect x="-4" y="50" width="8" height="18" fill={c.treeTrunk} />
      </g>

      {/* === Lamppost 3 === */}
      <g transform="translate(1180, 760)">
        <rect x="-2" y="0" width="4" height="50" rx="1" fill={c.lampOff} />
        <rect x="-8" y="-5" width="16" height="8" rx="3" fill={c.lampOff} />
        <circle cx="0" cy="-2" r="4" fill={isDayMode ? '#e0e0e0' : '#fcd34d'} opacity={isDayMode ? 0.6 : 0.9} />
        {!isDayMode && <circle cx="0" cy="10" r="35" fill="url(#lampGlow)" className="animate-lamp-glow" />}
      </g>

      {/* === House 6: Chapel with steeple === */}
      <g transform="translate(1240, 710)">
        <rect x="0" y="20" width="90" height="80" fill={c.bodyDark} />
        <polygon points="45,-15 -8,20 98,20" fill={c.roof} />
        <path d="M 45,-15 Q 20,0 -8,20 L 98,20 Q 70,0 45,-15" fill={c.snow} opacity="0.4" />
        <rect x="35" y="-30" width="20" height="20" fill={c.bodyDark} />
        <polygon points="45,-48 33,-30 57,-30" fill={c.roof} />
        <path d="M 45,-48 Q 39,-40 33,-30 L 57,-30 Q 51,-40 45,-48" fill={c.snow} opacity="0.45" />
        <circle cx="45" cy="38" r="12" fill={c.window} opacity={isDayMode ? 0.4 : 0.5} />
        <circle cx="45" cy="38" r="12" fill="none" stroke={c.bodyDark} strokeWidth="2" />
        <line x1="45" y1="26" x2="45" y2="50" stroke={c.bodyDark} strokeWidth="1.5" />
        <line x1="33" y1="38" x2="57" y2="38" stroke={c.bodyDark} strokeWidth="1.5" />
        {!isDayMode && <circle cx="45" cy="38" r="30" fill="url(#winGlow)" />}
        <rect x="12" y="60" width="14" height="20" rx="6" fill={c.window} opacity={isDayMode ? 0.45 : 0.6} />
        <rect x="64" y="60" width="14" height="20" rx="6" fill={c.windowAlt} opacity={isDayMode ? 0.4 : 0.55} />
        <rect x="33" y="78" width="24" height="22" rx="2" fill={c.door} />
        <ellipse cx="45" cy="78" rx="12" ry="8" fill={c.door} />
      </g>

      {/* === House 7: Cozy two-story === */}
      <g transform="translate(1420, 720)">
        <rect x="0" y="0" width="110" height="90" fill={c.body} />
        <polygon points="55,-35 -8,0 118,0" fill={c.roof} />
        <path d="M 55,-35 Q 25,-20 -8,0 L 118,0 Q 85,-20 55,-35" fill={c.snow} opacity="0.42" />
        <rect x="88" y="-25" width="14" height="25" fill={c.chimney} />
        <ellipse cx="95" cy="-25" rx="9" ry="3" fill={c.snow} opacity="0.5" />
        {!isDayMode && (
          <>
            <ellipse className="smoke" cx="95" cy="-29" rx="6" ry="4" fill="#8090b0" opacity="0.35" />
            <ellipse className="smoke smoke-d2" cx="95" cy="-29" rx="5" ry="3" fill="#8090b0" opacity="0.25" />
          </>
        )}
        <rect x="20" y="15" width="18" height="20" rx="1" fill={c.window} opacity={isDayMode ? 0.5 : 0.7} />
        <rect x="72" y="15" width="18" height="20" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.55 : 0.8} />
        <rect x="15" y="55" width="22" height="22" rx="1" fill={c.window} opacity={isDayMode ? 0.55 : 0.75} />
        <rect x="73" y="55" width="22" height="22" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.6} />
        {!isDayMode && <circle cx="55" cy="50" r="40" fill="url(#winGlow)" />}
        <rect x="42" y="65" width="24" height="25" rx="2" fill={c.door} />
        {/* Fence */}
        <g transform="translate(115, 60)">
          {[0, 12, 24, 36, 48].map((x) => (
            <rect key={x} x={x} y="0" width="3" height="18" rx="0.5" fill={c.fence} opacity="0.5" />
          ))}
          <rect x="0" y="5" width="51" height="2" rx="0.5" fill={c.fence} opacity="0.4" />
          <rect x="0" y="12" width="51" height="2" rx="0.5" fill={c.fence} opacity="0.4" />
        </g>
      </g>

      {/* === Lamppost 4 === */}
      <g transform="translate(1600, 760)">
        <rect x="-2" y="0" width="4" height="50" rx="1" fill={c.lampOff} />
        <rect x="-8" y="-5" width="16" height="8" rx="3" fill={c.lampOff} />
        <circle cx="0" cy="-2" r="4" fill={isDayMode ? '#e0e0e0' : '#fcd34d'} opacity={isDayMode ? 0.6 : 0.9} />
        {!isDayMode && <circle cx="0" cy="10" r="35" fill="url(#lampGlow)" className="animate-lamp-glow" />}
      </g>

      {/* === House 8: End cottage === */}
      <g transform="translate(1680, 745)">
        <rect x="0" y="0" width="85" height="65" fill={c.bodyAlt} />
        <polygon points="42,-23 -6,0 91,0" fill={c.roofDark} />
        <path d="M 42,-23 Q 20,-13 -6,0 L 91,0 Q 64,-13 42,-23" fill={c.snow} opacity="0.45" />
        <rect x="15" y="15" width="16" height="18" rx="1" fill={c.window} opacity={isDayMode ? 0.55 : 0.75} />
        <rect x="55" y="15" width="16" height="18" rx="1" fill={c.windowAlt} opacity={isDayMode ? 0.5 : 0.6} />
        {!isDayMode && <circle cx="42" cy="25" r="28" fill="url(#winGlow)" />}
        <rect x="34" y="38" width="18" height="27" rx="1" fill={c.door} />
      </g>

      {/* === Evergreen tree (far right) === */}
      <g transform="translate(1830, 755)">
        <polygon points="0,-48 -15,-8 -10,-8 -22,22 -12,22 -26,48 26,48 12,22 22,22 10,-8 15,-8" fill={c.tree} />
        <path d="M 0,-48 L 8,-25 L -4,-24 Z" fill={c.snow} opacity="0.45" />
        <path d="M -10,-8 L 4,-6 L -12,8 Z" fill={c.snow} opacity="0.35" />
        <rect x="-3" y="48" width="6" height="15" fill={c.treeTrunk} />
      </g>

      {/* Snow line along ground for texture */}
      <path
        d="M 0 810 Q 200 805 400 808 Q 600 815 800 808 Q 1000 803 1200 810 Q 1400 815 1600 808 Q 1800 803 1920 808"
        fill="none" stroke={c.snow} strokeWidth="3" opacity="0.3"
      />
    </svg>
  )
}

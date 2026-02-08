import { useEffect, useRef } from 'react'

interface BearConfig {
  initialX: number
  y: number
  scale: number
  bodyColor: string
  highlightColor: string
  darkColor: string
  minX: number
  maxX: number
  speed: number
  waddleDuration: number
}

function RoamingBear({ initialX, y, scale, bodyColor, highlightColor, darkColor, minX, maxX, speed, waddleDuration }: BearConfig) {
  const gRef = useRef<SVGGElement>(null)

  useEffect(() => {
    let currentX = initialX
    let targetX = initialX
    let direction = Math.random() > 0.5 ? 1 : -1
    let pause = Math.random() * 2000
    let lastTime = performance.now()
    let animId: number

    const pickNewTarget = () => {
      targetX = minX + Math.random() * (maxX - minX)
      direction = targetX > currentX ? 1 : -1
      pause = 1500 + Math.random() * 4000
    }

    const animate = (time: number) => {
      const dt = Math.min(time - lastTime, 100)
      lastTime = time

      if (pause > 0) {
        pause -= dt
        animId = requestAnimationFrame(animate)
        return
      }

      const dx = targetX - currentX
      if (Math.abs(dx) < 2) {
        pickNewTarget()
      } else {
        const step = Math.sign(dx) * speed * (dt / 1000)
        if (Math.abs(step) > Math.abs(dx)) {
          currentX = targetX
        } else {
          currentX += step
        }
      }

      currentX = Math.max(minX, Math.min(maxX, currentX))

      if (gRef.current) {
        gRef.current.setAttribute('transform',
          `translate(${currentX}, ${y}) scale(${scale * direction}, ${scale})`
        )
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [initialX, y, scale, minX, maxX, speed])

  return (
    <g ref={gRef} transform={`translate(${initialX}, ${y}) scale(${scale}, ${scale})`}>
      <g style={{ animation: `bear-waddle ${waddleDuration}s ease-in-out infinite` }}>
        <ellipse cx="0" cy="32" rx="28" ry="8" fill="#0a0604" opacity="0.3" />
        <ellipse cx="0" cy="15" rx="25" ry="18" fill={bodyColor} />
        <ellipse cx="-5" cy="12" rx="12" ry="10" fill={highlightColor} opacity="0.6" />
        <circle cx="22" cy="0" r="14" fill={bodyColor} />
        <circle cx="14" cy="-12" r="5" fill={bodyColor} />
        <circle cx="14" cy="-12" r="3" fill={darkColor} />
        <circle cx="30" cy="-10" r="5" fill={bodyColor} />
        <circle cx="30" cy="-10" r="3" fill={darkColor} />
        <ellipse cx="32" cy="2" rx="7" ry="5" fill="#8a7a68" />
        <ellipse cx="34" cy="0" rx="3" ry="2" fill="#2a1a0a" />
        <circle cx="24" cy="-3" r="2" fill="#1a0a00" />
        <circle cx="24" cy="-4" r="0.8" fill="#ffffff" opacity="0.6" />
        <ellipse cx="18" cy="28" rx="6" ry="8" fill={darkColor} />
        <ellipse cx="-15" cy="28" rx="7" ry="8" fill={darkColor} />
        <circle cx="-24" cy="8" r="4" fill={bodyColor} />
      </g>
    </g>
  )
}

type GroundLayerProps = { isDayMode: boolean }

export function GroundLayer({ isDayMode }: GroundLayerProps) {
  const c = isDayMode
    ? {
      snowFar: '#d0dae8',
      snowFarOpacity: 0.6,
      snowMid: '#c0cee0',
      snowMidOpacity: 0.5,
      snowNear: '#b8c8dc',
      snowNearOpacity: 0.45,
      walkway: '#a8b5cc',
      walkwayOpacity: 0.35,
      bush: '#6b8a5e',
      bushSnow: '#e8edf5',
      bushShadow: '#4a6840',
      mound: '#c8d5e8',
    }
    : {
      snowFar: '#c8d3e8',
      snowFarOpacity: 0.25,
      snowMid: '#a0afc8',
      snowMidOpacity: 0.12,
      snowNear: '#8898b5',
      snowNearOpacity: 0.1,
      walkway: '#b0bdd5',
      walkwayOpacity: 0.18,
      bush: '#1e2538',
      bushSnow: '#c8d3e5',
      bushShadow: '#1a2030',
      mound: '#b8c5dd',
    }

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: 'all 1s ease-in-out' }}
    >
      <defs>
        {/* Campfire glow */}
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8c00" stopOpacity={isDayMode ? 0.08 : 0.25} />
          <stop offset="40%" stopColor="#ff6600" stopOpacity={isDayMode ? 0.04 : 0.12} />
          <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
        </radialGradient>

        {/* Ground light from campfire */}
        <radialGradient id="fireGroundLight" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#ff9944" stopOpacity={isDayMode ? 0.06 : 0.15} />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>

        <filter id="fireBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <filter id="glowWarm" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>

      {/* Main snowy ground - furthest back undulation */}
      <path
        d="M 0 820 Q 200 800 400 810 Q 600 825 800 815 Q 1000 800 1200 812 Q 1400 828 1600 815 Q 1800 805 1920 815 L 1920 1080 L 0 1080 Z"
        fill={c.snowFar}
        opacity={c.snowFarOpacity}
      />

      {/* Middle snow layer */}
      <path
        d="M 0 850 Q 250 838 500 845 Q 750 855 1000 842 Q 1250 835 1500 848 Q 1750 858 1920 848 L 1920 1080 L 0 1080 Z"
        fill={c.snowMid}
        opacity={c.snowMidOpacity}
      />

      {/* Nearest snow layer */}
      <path
        d="M 0 880 Q 300 870 600 878 Q 900 888 1200 875 Q 1500 868 1920 880 L 1920 1080 L 0 1080 Z"
        fill={c.snowNear}
        opacity={c.snowNearOpacity}
      />



      {/* Snow-covered bush 1 */}
      <g transform="translate(180, 855)">
        <ellipse cx="0" cy="5" rx="22" ry="14" fill={c.bushShadow} opacity="0.3" />
        <ellipse cx="0" cy="0" rx="20" ry="10" fill={c.bushSnow} opacity="0.2" />
        <ellipse cx="-8" cy="-2" rx="10" ry="7" fill={c.bushSnow} opacity="0.15" />
      </g>

      {/* Snow-covered bush 2 */}
      <g transform="translate(1350, 845)">
        <ellipse cx="0" cy="6" rx="18" ry="12" fill={c.bushShadow} opacity="0.25" />
        <ellipse cx="0" cy="0" rx="16" ry="8" fill={c.bushSnow} opacity="0.18" />
        <ellipse cx="5" cy="-2" rx="8" ry="5" fill={c.bushSnow} opacity="0.12" />
      </g>

      {/* Snow-covered bush 3 */}
      <g transform="translate(700, 860)">
        <ellipse cx="0" cy="5" rx="15" ry="10" fill={c.bushShadow} opacity="0.22" />
        <ellipse cx="0" cy="0" rx="13" ry="7" fill={c.bushSnow} opacity="0.15" />
      </g>

      {/* Small snow mounds */}
      <ellipse cx="450" cy="870" rx="30" ry="5" fill={c.mound} opacity="0.1" />
      <ellipse cx="1650" cy="865" rx="25" ry="4" fill={c.mound} opacity="0.08" />
      <ellipse cx="1100" cy="875" rx="20" ry="3" fill={c.mound} opacity="0.07" />

      {/* ========= FOREGROUND HOUSES - Closer tier ========= */}
      {/* These houses are larger and positioned to fill the gap between campfire and distant houses */}

      {/* Foreground House 1 - Left side, large cottage */}
      <g transform="translate(120, 780)">
        <rect x="0" y="20" width="140" height="90" fill={isDayMode ? '#8b9dc3' : '#2a2545'} />
        <polygon points="70,-20 -12,20 152,20" fill={isDayMode ? '#6b7a9a' : '#1e1a38'} />
        <path d="M 70,-20 Q 30,0 -12,20 L 152,20 Q 110,0 70,-20" fill={c.snowFar} opacity="0.45" />
        {/* Chimney */}
        <rect x="110" y="-10" width="18" height="30" fill={isDayMode ? '#5a6a8a' : '#1a1530'} />
        <ellipse cx="119" cy="-10" rx="12" ry="4" fill={c.snowFar} opacity="0.5" />
        {/* Windows */}
        <rect x="20" y="45" width="28" height="32" rx="2" fill={isDayMode ? '#a8c8e8' : '#fbbf24'} opacity={isDayMode ? 0.5 : 0.75} />
        <rect x="92" y="45" width="28" height="32" rx="2" fill={isDayMode ? '#90b8d8' : '#fbbf24'} opacity={isDayMode ? 0.45 : 0.6} />
        {!isDayMode && <circle cx="70" cy="60" r="50" fill="url(#fireGlow)" opacity="0.15" />}
        {/* Door */}
        <rect x="55" y="68" width="30" height="42" rx="3" fill={isDayMode ? '#4a5a7a' : '#1a1530'} />
        <circle cx="80" cy="90" r="2.5" fill="#fbbf24" opacity="0.4" />
      </g>

      {/* Foreground House 2 - Left side, smaller */}
      <g transform="translate(320, 800)">
        <rect x="0" y="15" width="100" height="70" fill={isDayMode ? '#7a8db5' : '#252040'} />
        <polygon points="50,-15 -8,15 108,15" fill={isDayMode ? '#5a6a8a' : '#1c1735'} />
        <path d="M 50,-15 Q 22,0 -8,15 L 108,15 Q 78,0 50,-15" fill={c.snowFar} opacity="0.4" />
        {/* Windows */}
        <rect x="15" y="35" width="22" height="26" rx="1" fill={isDayMode ? '#a8c8e8' : '#fbbf24'} opacity={isDayMode ? 0.5 : 0.7} />
        <rect x="63" y="35" width="22" height="26" rx="1" fill={isDayMode ? '#90b8d8' : '#fbbf24'} opacity={isDayMode ? 0.45 : 0.55} />
        {!isDayMode && <circle cx="50" cy="48" r="35" fill="url(#fireGlow)" opacity="0.12" />}
        {/* Door */}
        <rect x="38" y="55" width="24" height="30" rx="2" fill={isDayMode ? '#4a5a7a' : '#1a1530'} />
      </g>

      {/* Foreground House 3 - Right side, tall house */}
      <g transform="translate(1620, 770)">
        <rect x="0" y="0" width="120" height="110" fill={isDayMode ? '#6b7ea8' : '#28233f'} />
        <polygon points="60,-35 -10,0 130,0" fill={isDayMode ? '#5a6a8a' : '#1e1a38'} />
        <path d="M 60,-35 Q 25,-18 -10,0 L 130,0 Q 95,-18 60,-35" fill={c.snowFar} opacity="0.42" />
        {/* Chimney */}
        <rect x="90" y="-25" width="16" height="25" fill={isDayMode ? '#5a6a8a' : '#1a1530'} />
        <ellipse cx="98" cy="-25" rx="10" ry="3" fill={c.snowFar} opacity="0.5" />
        {/* Upper windows */}
        <rect x="20" y="20" width="24" height="28" rx="1" fill={isDayMode ? '#a8c8e8' : '#fbbf24'} opacity={isDayMode ? 0.5 : 0.7} />
        <rect x="76" y="20" width="24" height="28" rx="1" fill={isDayMode ? '#90b8d8' : '#fbbf24'} opacity={isDayMode ? 0.45 : 0.55} />
        {/* Lower windows */}
        <rect x="15" y="65" width="28" height="30" rx="1" fill={isDayMode ? '#a8c8e8' : '#fbbf24'} opacity={isDayMode ? 0.55 : 0.75} />
        <rect x="77" y="65" width="28" height="30" rx="1" fill={isDayMode ? '#90b8d8' : '#fbbf24'} opacity={isDayMode ? 0.5 : 0.6} />
        {!isDayMode && <circle cx="60" cy="55" r="55" fill="url(#fireGlow)" opacity="0.15" />}
        {/* Door */}
        <rect x="45" y="78" width="30" height="32" rx="2" fill={isDayMode ? '#4a5a7a' : '#1a1530'} />
        <ellipse cx="60" cy="78" rx="15" ry="8" fill={isDayMode ? '#4a5a7a' : '#1a1530'} />
      </g>

      {/* Foreground House 4 - Far right, cozy bungalow */}
      <g transform="translate(1780, 810)">
        <rect x="0" y="12" width="110" height="68" fill={isDayMode ? '#8b9dc3' : '#2a2545'} />
        <polygon points="55,-18 -8,12 118,12" fill={isDayMode ? '#6b7a9a' : '#1e1a38'} />
        <path d="M 55,-18 Q 25,-5 -8,12 L 118,12 Q 85,-5 55,-18" fill={c.snowFar} opacity="0.43" />
        {/* Windows */}
        <rect x="15" y="30" width="25" height="28" rx="1" fill={isDayMode ? '#a8c8e8' : '#fbbf24'} opacity={isDayMode ? 0.5 : 0.7} />
        <rect x="70" y="30" width="25" height="28" rx="1" fill={isDayMode ? '#90b8d8' : '#fbbf24'} opacity={isDayMode ? 0.45 : 0.6} />
        {!isDayMode && <circle cx="55" cy="45" r="40" fill="url(#fireGlow)" opacity="0.12" />}
        {/* Door */}
        <rect x="42" y="48" width="26" height="32" rx="2" fill={isDayMode ? '#4a5a7a' : '#1a1530'} />
      </g>

      {/* ========= ROAMING BEARS ========= */}
      {/* Bear 1 - large, right side near campfire */}
      <RoamingBear initialX={1350} y={830} scale={1.4} bodyColor="#4a3828" highlightColor="#5c4a38" darkColor="#3a2818" minX={1150} maxX={1500} speed={25} waddleDuration={0.8} />
      {/* Bear 2 - cub, right side */}
      <RoamingBear initialX={1550} y={890} scale={1.0} bodyColor="#5c4a38" highlightColor="#6c5a48" darkColor="#4a3828" minX={1400} maxX={1750} speed={35} waddleDuration={0.9} />
      {/* Bear 3 - medium, left of campfire */}
      <RoamingBear initialX={350} y={930} scale={1.2} bodyColor="#5a4030" highlightColor="#6a5040" darkColor="#4a3020" minX={200} maxX={550} speed={20} waddleDuration={0.7} />
      {/* Bear 4 - large, left side */}
      <RoamingBear initialX={200} y={910} scale={1.3} bodyColor="#4a3525" highlightColor="#5c4535" darkColor="#3a2515" minX={100} maxX={450} speed={15} waddleDuration={1.0} />
      {/* Bear 5 - cub, far right */}
      <RoamingBear initialX={1750} y={900} scale={0.85} bodyColor="#6c5a48" highlightColor="#7c6a58" darkColor="#5c4a38" minX={1600} maxX={1860} speed={40} waddleDuration={0.85} />
      {/* Bear 6 - medium, center-left */}
      <RoamingBear initialX={450} y={940} scale={1.1} bodyColor="#554035" highlightColor="#655045" darkColor="#453025" minX={250} maxX={600} speed={22} waddleDuration={0.75} />


      <g transform="translate(960, 900) scale(2.5)">
        {/* Ground light from fire - larger glow */}
        <ellipse cx="0" cy="45" rx="220" ry="70" fill="url(#fireGroundLight)" />

        {/* Warm ambient glow behind fire - more prominent */}
        <circle cx="0" cy="-5" r="120" fill="url(#fireGlow)" filter="url(#glowWarm)" />

        {/* Secondary outer glow for depth */}
        <circle cx="0" cy="0" r="80" fill="#ff6600" opacity="0.08" filter="url(#glowWarm)" />

        {/* === Log seat left - DARK SOLID WOOD === */}
        <g transform="translate(-100, 15)">
          {/* Shadow under log */}
          <ellipse cx="0" cy="14" rx="32" ry="7" fill="#0a0604" />
          {/* Log body - dark solid wood */}
          <ellipse cx="0" cy="10" rx="30" ry="8" fill="#2a1810" />
          <rect x="-28" y="-5" width="56" height="18" rx="7" fill="#3d2517" />
          {/* Bark texture lines */}
          <line x1="-20" y1="-1" x2="20" y2="-1" stroke="#2a1810" strokeWidth="1.5" />
          <line x1="-18" y1="3" x2="22" y2="3" stroke="#2a1810" strokeWidth="1.2" />
          <line x1="-16" y1="7" x2="18" y2="7" stroke="#1a1008" strokeWidth="1" />
          {/* Log end rings - solid dark */}
          <ellipse cx="-26" cy="4" rx="5" ry="10" fill="#2a1810" />
          <ellipse cx="-26" cy="4" rx="3" ry="6" fill="#3d2517" />
          <ellipse cx="-26" cy="4" rx="1.5" ry="3" fill="#2a1810" />
          <ellipse cx="26" cy="4" rx="5" ry="10" fill="#2a1810" />
          <ellipse cx="26" cy="4" rx="3" ry="6" fill="#3d2517" />
          <ellipse cx="26" cy="4" rx="1.5" ry="3" fill="#2a1810" />
        </g>

        {/* === Log seat right - DARK SOLID WOOD === */}
        <g transform="translate(95, 10)">
          {/* Shadow under log */}
          <ellipse cx="0" cy="16" rx="30" ry="6" fill="#0a0604" />
          {/* Log body - dark solid wood */}
          <ellipse cx="0" cy="12" rx="28" ry="7" fill="#2a1810" />
          <rect x="-26" y="-3" width="52" height="17" rx="7" fill="#4a3020" />
          {/* Bark texture lines */}
          <line x1="-18" y1="1" x2="18" y2="1" stroke="#2a1810" strokeWidth="1.5" />
          <line x1="-16" y1="5" x2="20" y2="5" stroke="#2a1810" strokeWidth="1.2" />
          <line x1="-14" y1="9" x2="16" y2="9" stroke="#1a1008" strokeWidth="1" />
          {/* Log end rings - solid dark */}
          <ellipse cx="-24" cy="5" rx="4.5" ry="9" fill="#2a1810" />
          <ellipse cx="-24" cy="5" rx="2.5" ry="5" fill="#3d2517" />
          <ellipse cx="-24" cy="5" rx="1" ry="2.5" fill="#2a1810" />
          <ellipse cx="24" cy="5" rx="4.5" ry="9" fill="#2a1810" />
          <ellipse cx="24" cy="5" rx="2.5" ry="5" fill="#3d2517" />
          <ellipse cx="24" cy="5" rx="1" ry="2.5" fill="#2a1810" />
        </g>

        {/* === Campfire base (stone ring) - enhanced === */}
        <ellipse cx="0" cy="22" rx="35" ry="10" fill="#2a2a2a" />
        {/* Individual stones - larger and more detailed */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => (
          <g key={angle}>
            <ellipse
              cx={Math.cos((angle * Math.PI) / 180) * 28}
              cy={22 + Math.sin((angle * Math.PI) / 180) * 8}
              rx="7"
              ry="5"
              fill="#4a4a4a"
            />
            <ellipse
              cx={Math.cos((angle * Math.PI) / 180) * 28 - 1}
              cy={22 + Math.sin((angle * Math.PI) / 180) * 8 - 1}
              rx="5"
              ry="3.5"
              fill="#5a5a5a"
            />
          </g>
        ))}

        {/* Ash bed inside ring */}
        <ellipse cx="0" cy="18" rx="22" ry="7" fill="#2d2d2d" />
        <ellipse cx="-4" cy="17" rx="8" ry="3" fill="#3a3a3a" />

        {/* Firewood logs - more prominent */}
        <line x1="-16" y1="16" x2="14" y2="8" stroke="#5c3a1e" strokeWidth="6" strokeLinecap="round" />
        <line x1="12" y1="18" x2="-10" y2="6" stroke="#6b4422" strokeWidth="5" strokeLinecap="round" />
        <line x1="-6" y1="17" x2="8" y2="4" stroke="#4a2e14" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="2" y1="16" x2="-12" y2="2" stroke="#5c3a1e" strokeWidth="4" strokeLinecap="round" />

        {/* Glowing embers/coals - more vibrant */}
        <ellipse cx="-3" cy="14" rx="14" ry="5" fill="#ff2200" opacity="0.5" filter="url(#fireBlur)" />
        <ellipse cx="2" cy="12" rx="8" ry="3" fill="#ff4400" opacity="0.6" filter="url(#fireBlur)" />
        <ellipse cx="-5" cy="13" rx="5" ry="2" fill="#ff6600" opacity="0.7" />

        {/* === Realistic Fire === */}
        {/* Soft outer glow */}
        <ellipse cx="0" cy="-8" rx="30" ry="38" fill="#ff3300" opacity="0.15" filter="url(#fireBlur)" />

        {/* Outermost flame - large irregular shape */}
        <path
          d="M 0 14 C -6 12 -16 4 -18 -6 C -20 -16 -15 -26 -12 -34 C -9 -40 -5 -46 -3 -42 C -1 -38 -4 -30 -2 -36 C 0 -50 2 -36 4 -42 C 6 -46 10 -38 13 -32 C 16 -24 20 -14 18 -4 C 16 6 6 12 0 14 Z"
          fill="#aa1800"
          opacity="0.7"
          className="animate-flame-main"
        />
        {/* Main flame body - asymmetric organic shape */}
        <path
          d="M 0 12 C -5 10 -14 2 -15 -8 C -16 -18 -11 -28 -8 -36 C -5 -44 -2 -40 0 -46 C 2 -40 5 -44 8 -36 C 11 -28 16 -18 15 -8 C 14 2 5 10 0 12 Z"
          fill="#dd3300"
          opacity="0.85"
          className="animate-flame-body"
        />
        {/* Secondary inner flame */}
        <path
          d="M 0 10 C -4 8 -11 0 -10 -10 C -9 -20 -6 -30 -3 -36 C -1 -40 1 -40 3 -36 C 6 -30 9 -20 10 -10 C 11 0 4 8 0 10 Z"
          fill="#ee5500"
          opacity="0.9"
          className="animate-flame-inner"
        />
        {/* Bright orange layer */}
        <path
          d="M 0 8 C -3 6 -8 -2 -7 -12 C -6 -22 -3 -28 0 -32 C 3 -28 6 -22 7 -12 C 8 -2 3 6 0 8 Z"
          fill="#ff8800"
          opacity="0.95"
          className="animate-flame-main"
        />
        {/* Yellow-hot core */}
        <path
          d="M 0 6 C -2 4 -5 -2 -4 -10 C -3 -18 -1 -22 0 -24 C 1 -22 3 -18 4 -10 C 5 -2 2 4 0 6 Z"
          fill="#ffbb00"
          opacity="1"
          className="animate-flame-core"
        />
        {/* White-hot center tip */}
        <path
          d="M 0 4 C -1 2 -2.5 -4 -1.5 -10 C -0.5 -14 0 -16 0 -16 C 0 -16 0.5 -14 1.5 -10 C 2.5 -4 1 2 0 4 Z"
          fill="#ffeebb"
          opacity="0.9"
          className="animate-flame-core"
        />

        {/* Left dancing tongue - tall wispy */}
        <path
          d="M -5 10 C -9 6 -17 -2 -16 -14 C -15 -22 -13 -30 -10 -26 C -8 -22 -9 -14 -7 -8 C -5 -2 -4 6 -5 10 Z"
          fill="#ee4400"
          opacity="0.7"
          className="animate-flame-left"
        />
        {/* Right dancing tongue - tall wispy */}
        <path
          d="M 5 10 C 9 6 17 -2 16 -14 C 15 -22 13 -30 10 -26 C 8 -22 9 -14 7 -8 C 5 -2 4 6 5 10 Z"
          fill="#ee4400"
          opacity="0.7"
          className="animate-flame-right"
        />
        {/* Left small lick */}
        <path
          d="M -8 8 C -12 4 -18 -4 -14 -12 C -11 -18 -9 -14 -8 -8 C -7 -2 -7 6 -8 8 Z"
          fill="#ff6600"
          opacity="0.55"
          className="animate-flame-lick-l"
        />
        {/* Right small lick */}
        <path
          d="M 8 8 C 12 4 18 -4 14 -12 C 11 -18 9 -14 8 -8 C 7 -2 7 6 8 8 Z"
          fill="#ff6600"
          opacity="0.55"
          className="animate-flame-lick-r"
        />
        {/* Stray left wisp - breaks the symmetry */}
        <path
          d="M -10 6 C -14 2 -20 -8 -16 -18 C -13 -24 -11 -20 -10 -14 C -9 -8 -9 4 -10 6 Z"
          fill="#cc3300"
          opacity="0.45"
          className="animate-flame-left"
        />

        {/* Sparks - more of them, scattered */}
        <circle cx="-6" cy="-40" r="1.8" fill="#ffdd44" opacity="0.85" className="animate-spark-1" />
        <circle cx="7" cy="-46" r="1.5" fill="#ff8844" opacity="0.75" className="animate-spark-2" />
        <circle cx="-3" cy="-50" r="1.2" fill="#ffaa44" opacity="0.65" className="animate-spark-3" />
        <circle cx="10" cy="-38" r="1" fill="#ffcc66" opacity="0.6" className="animate-spark-1" />
        <circle cx="-9" cy="-44" r="0.9" fill="#ff9944" opacity="0.55" className="animate-spark-2" />
        <circle cx="4" cy="-52" r="0.8" fill="#ffbb55" opacity="0.5" className="animate-spark-3" />

        {/* === PROMINENT SMOKE WISPS === */}
        {/* Larger, more visible smoke that rises */}
        <ellipse cx="-5" cy="-48" rx="10" ry="5" fill="#9999aa" opacity="0.2" className="animate-smoke-wisp" />
        <ellipse cx="6" cy="-58" rx="12" ry="6" fill="#888899" opacity="0.18" className="animate-smoke-wisp" style={{ animationDelay: '0.8s' }} />
        <ellipse cx="-3" cy="-70" rx="14" ry="7" fill="#777788" opacity="0.15" className="animate-smoke-wisp" style={{ animationDelay: '1.6s' }} />
        <ellipse cx="4" cy="-82" rx="16" ry="8" fill="#666677" opacity="0.12" className="animate-smoke-wisp" style={{ animationDelay: '2.4s' }} />
        <ellipse cx="-2" cy="-95" rx="18" ry="9" fill="#555566" opacity="0.1" className="animate-smoke-wisp" style={{ animationDelay: '3.2s' }} />
        <ellipse cx="3" cy="-110" rx="20" ry="10" fill="#555566" opacity="0.08" className="animate-smoke-wisp" style={{ animationDelay: '4s' }} />
      </g>
    </svg>
  )
}

import { useCanvasStore } from '../../state/canvasStore'

export const ThermometerHUD = () => {
  const warmth = useCanvasStore((state) => state.warmth)
  const gameMode = useCanvasStore((state) => state.gameMode)
  const quizResult = useCanvasStore((state) => state.quizResult)

  if (gameMode !== 'blizzard') return null

  // Determine fill color based on warmth level
  let fillColor = 'bg-blue-400' // cold
  if (warmth > 60) {
    fillColor = 'bg-amber-500' // warm
  } else if (warmth > 30) {
    fillColor = 'bg-yellow-500' // medium
  }

  // Determine glow color
  let glowColor = 'rgba(96, 165, 250, 0.5)' // blue
  if (warmth > 60) {
    glowColor = 'rgba(245, 158, 11, 0.5)' // amber
  } else if (warmth > 30) {
    glowColor = 'rgba(234, 179, 8, 0.5)' // yellow
  }

  // Animation classes based on quiz result
  let animationClass = ''
  if (quizResult === 'correct') {
    animationClass = 'animate-scale-correct'
  } else if (quizResult === 'wrong') {
    animationClass = 'animate-shake'
  }

  return (
    <div
      className={`fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center ${animationClass}`}
      style={{ zIndex: 'var(--z-hud)' }}
    >
      {/* Thermometer container */}
      <div className="relative w-8 h-48 frosted-glass rounded-full overflow-hidden flex flex-col-reverse">
        {/* Tick marks */}
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="w-full h-[1px] bg-white/20"
              style={{ marginLeft: 0 }}
            />
          ))}
        </div>

        {/* Fill */}
        <div
          className={`${fillColor} rounded-b-full transition-all duration-700 ease-in-out`}
          style={{
            height: `${warmth}%`,
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        />
      </div>

      {/* Label */}
      <div className="text-frost/60 text-xs font-body text-center mt-2">
        Warmth
      </div>
    </div>
  )
}

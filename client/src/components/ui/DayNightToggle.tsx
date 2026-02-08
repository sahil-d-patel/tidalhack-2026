import { useCanvasStore } from '../../state/canvasStore'

export function DayNightToggle() {
  const isDayMode = useCanvasStore((state) => state.isDayMode)
  const toggleDayMode = useCanvasStore((state) => state.toggleDayMode)

  return (
    <button
      onClick={toggleDayMode}
      className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        background: isDayMode
          ? 'rgba(251, 191, 36, 0.2)'
          : 'rgba(148, 163, 184, 0.2)',
        border: `1px solid ${isDayMode ? 'rgba(251, 191, 36, 0.4)' : 'rgba(148, 163, 184, 0.3)'}`,
        backdropFilter: 'blur(8px)',
      }}
      title={isDayMode ? 'Switch to night' : 'Switch to day'}
    >
      <span className="text-base leading-none">
        {isDayMode ? '☀️' : '🌙'}
      </span>
    </button>
  )
}

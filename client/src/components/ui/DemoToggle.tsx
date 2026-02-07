import { useCanvasStore } from '../../state/canvasStore'

export function DemoToggle() {
  const demoMode = useCanvasStore((state) => state.demoMode)
  const toggleDemoMode = useCanvasStore((state) => state.toggleDemoMode)

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
      <span className="text-xs font-body text-frost/60">Demo Mode</span>
      <button
        onClick={toggleDemoMode}
        className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        style={{
          backgroundColor: demoMode ? '#f59e0b' : '#475569',
        }}
        aria-label="Toggle demo mode"
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200"
          style={{
            left: demoMode ? 'calc(100% - 18px)' : '2px',
          }}
        />
      </button>
      <span
        className={`text-xs font-body font-medium transition-colors duration-200 ${
          demoMode ? 'text-accent-warm' : 'text-frost/40'
        }`}
      >
        {demoMode ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

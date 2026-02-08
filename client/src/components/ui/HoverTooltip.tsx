export function HoverTooltip() {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50
                 animate-in fade-in slide-in-from-top-1 duration-200"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="frosted-glass text-frost text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
      >
        <span className="flex items-center gap-1">
          <span>💡</span>
          <span>Click to learn more!</span>
        </span>
      </div>
      {/* Tooltip arrow */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2
                   bg-slate-900/70 border-l border-t border-slate-400/30
                   rotate-45"
      />
    </div>
  )
}


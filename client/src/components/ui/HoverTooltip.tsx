type HoverTooltipProps = {
  fact: string
  isLoading: boolean
}

export function HoverTooltip({ fact, isLoading }: HoverTooltipProps) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50
                 animate-in fade-in slide-in-from-top-1 duration-200"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="frosted-glass text-frost text-xs rounded-lg px-3 py-2 max-w-[250px] shadow-lg"
      >
        {isLoading ? (
          <span className="inline-block animate-snowflake-spin text-frost/60 text-base">&#10052;</span>
        ) : (
          <span>{fact}</span>
        )}
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

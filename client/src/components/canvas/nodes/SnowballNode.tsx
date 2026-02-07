import React, { useState, useEffect } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useCanvasStore } from '../../../state/canvasStore'
import { HoverTooltip } from '../../ui/HoverTooltip'
import type { QuizData } from '../../../config/api'

export type SnowballNodeData = {
  label: string
  quiz?: QuizData | null
  parentTopic?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SnowballNode = React.memo((props: any) => {
  const { id, data } = props as { id: string; data: SnowballNodeData }
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Select individual slices for performance
  const expandNode = useCanvasStore((state) => state.expandNode)
  const fetchFunFact = useCanvasStore((state) => state.fetchFunFact)
  const clearHoveredFact = useCanvasStore((state) => state.clearHoveredFact)
  const isExpanding = useCanvasStore((state) => state.isExpanding)
  const expandingNodeId = useCanvasStore((state) => state.expandingNodeId)
  const expandedNodeIds = useCanvasStore((state) => state.expandedNodeIds)
  const hoveredFact = useCanvasStore((state) => state.hoveredFact)
  const isLoadingFact = useCanvasStore((state) => state.isLoadingFact)

  const isThisNodeExpanding = isExpanding && expandingNodeId === id
  const isExpanded = expandedNodeIds.includes(id)
  const hasQuiz = data.quiz !== undefined && data.quiz !== null
  const showTooltip = hoveredFact?.nodeId === id

  // Handle click to expand
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isExpanding && !isExpanded) {
      expandNode(id, data.label)
    }
  }

  // Handle hover for fun fact
  const handleMouseEnter = () => {
    const timer = setTimeout(() => {
      fetchFunFact(id, data.label)
    }, 500) // 500ms debounce
    setHoverTimer(timer)
  }

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
    clearHoveredFact()
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer)
      }
    }
  }, [hoverTimer])

  // Determine cursor style
  const getCursor = () => {
    if (isExpanded) return 'default'
    if (isThisNodeExpanding) return 'wait'
    return 'pointer'
  }

  return (
    <div
      className={`relative rounded-2xl bg-white/90 px-5 py-3 border
                 text-slate-700 font-body text-sm
                 transition-all duration-200
                 ${isThisNodeExpanding ? 'animate-pulse' : ''}
                 ${!isExpanded && !isThisNodeExpanding ? 'hover:scale-105 hover:shadow-lg' : ''}
                 ${isExpanded ? 'border-amber-300/50 bg-white/80' : 'border-slate-200/50'}`}
      style={{
        boxShadow: 'inset 0 2px 8px rgba(191,219,254,0.3)',
        cursor: getCursor(),
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-slate-300 opacity-50"
      />

      {/* Node label */}
      <div className="flex items-center gap-1.5">
        <span>{data.label}</span>
        {hasQuiz && (
          <span className="text-xs text-blue-400" title="Has quiz">
            ❄
          </span>
        )}
      </div>

      {/* Expand indicator for unexpanded nodes */}
      {!isExpanded && !isThisNodeExpanding && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-200/80 rounded-full flex items-center justify-center text-[10px] text-slate-500">
          +
        </div>
      )}

      {/* Hover tooltip */}
      {showTooltip && hoveredFact && (
        <HoverTooltip fact={hoveredFact.fact} isLoading={isLoadingFact} />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-slate-300 opacity-50"
      />
    </div>
  )
})

SnowballNode.displayName = 'SnowballNode'

export default SnowballNode

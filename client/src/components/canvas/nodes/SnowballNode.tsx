import React, { useState, useEffect } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useCanvasStore } from '../../../state/canvasStore'
import { HoverTooltip } from '../../ui/HoverTooltip'
import { MacPopup } from '../../ui/MacPopup'
import type { QuizData } from '../../../config/api'

export type SnowballNodeData = {
  label: string
  quiz?: QuizData | null
  parentTopic?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SnowballNode = React.memo((props: any) => {
  const { id, data } = props as { id: string; data: SnowballNodeData }
  const [isHovered, setIsHovered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Select individual slices for performance
  const expandNode = useCanvasStore((state) => state.expandNode)
  const fetchFunFact = useCanvasStore((state) => state.fetchFunFact)
  const clearHoveredFact = useCanvasStore((state) => state.clearHoveredFact)
  const isExpanding = useCanvasStore((state) => state.isExpanding)
  const expandingNodeId = useCanvasStore((state) => state.expandingNodeId)
  const expandedNodeIds = useCanvasStore((state) => state.expandedNodeIds)
  const hoveredFact = useCanvasStore((state) => state.hoveredFact)
  const isLoadingFact = useCanvasStore((state) => state.isLoadingFact)
  const gameMode = useCanvasStore((state) => state.gameMode)
  const enterBlizzard = useCanvasStore((state) => state.enterBlizzard)
  const blizzardQuiz = useCanvasStore((state) => state.blizzardQuiz)
  const edges = useCanvasStore((state) => state.edges)

  const isThisNodeExpanding = isExpanding && expandingNodeId === id
  // Check if this node has children by looking at edges where this node is the source
  const hasChildren = edges.some((edge) => edge.source === id)
  const isExpanded = expandedNodeIds.includes(id) || hasChildren
  const hasQuiz = data.quiz !== undefined && data.quiz !== null
  const isBlizzardActive = blizzardQuiz?.nodeId === id
  const showBraveTheStorm = hasQuiz && gameMode === 'peace' && !isExpanding

  // Get the fact for this node
  const currentFact = hoveredFact?.nodeId === id ? hoveredFact.fact : null

  // Handle click to show popup (for unexpanded nodes)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isExpanding && !isExpanded && !showPopup) {
      setShowPopup(true)
      setIsHovered(false)
      // Fetch the fact when opening popup
      fetchFunFact(id, data.label)
    }
  }

  // Handle expand from popup
  const handleExpand = () => {
    setShowPopup(false)
    clearHoveredFact()
    expandNode(id, data.label)
  }

  // Handle close popup
  const handleClosePopup = () => {
    setShowPopup(false)
    clearHoveredFact()
  }

  // Handle hover
  const handleMouseEnter = () => {
    if (!showPopup && !isExpanded) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Close popup when expanding finishes
  useEffect(() => {
    if (!isExpanding && showPopup) {
      // Keep popup open after expansion finishes if still showing
    }
  }, [isExpanding, showPopup])

  // Determine cursor style
  const getCursor = () => {
    if (isExpanded) return 'default'
    if (isThisNodeExpanding) return 'wait'
    return 'pointer'
  }

  // Handle "Brave the Storm" click
  const handleBlizzardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (data.quiz) {
      enterBlizzard(id, data.label, data.quiz)
    }
  }

  return (
    <div
      className={`relative rounded-2xl bg-white/90 px-5 py-3 border
                 text-slate-700 font-body text-sm
                 transition-all duration-200
                 ${isThisNodeExpanding ? 'animate-snowflake-spin' : ''}
                 ${!isExpanded && !isThisNodeExpanding ? 'hover:scale-105 hover:shadow-lg' : ''}
                 ${isExpanded ? 'border-amber-300/50 bg-white/80' : 'border-slate-200/50'}
                 ${isBlizzardActive ? 'ring-2 ring-blue-400/60 animate-pulse' : ''}`}
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
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span>{data.label}</span>
          {hasQuiz && (
            <span className="text-xs text-blue-400" title="Has quiz">
              ❄
            </span>
          )}
        </div>

        {/* Brave the Storm button */}
        {showBraveTheStorm && (
          <button
            onClick={handleBlizzardClick}
            className="bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] font-body px-2 py-0.5 rounded-full mt-1 transition-all flex items-center gap-1"
          >
            <span>❄</span>
            <span>Brave the Storm</span>
          </button>
        )}
      </div>

      {/* Expand indicator for unexpanded nodes */}
      {!isExpanded && !isThisNodeExpanding && !showPopup && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-200/80 rounded-full flex items-center justify-center text-[10px] text-slate-500">
          +
        </div>
      )}

      {/* Hover tooltip - simple "Click to learn more!" */}
      {isHovered && !showPopup && !isExpanded && (
        <HoverTooltip />
      )}

      {/* macOS-style popup with fun fact */}
      {showPopup && (
        <MacPopup
          title={data.label}
          content={currentFact || 'Loading...'}
          isLoading={isLoadingFact}
          onClose={handleClosePopup}
          onExpand={handleExpand}
        />
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

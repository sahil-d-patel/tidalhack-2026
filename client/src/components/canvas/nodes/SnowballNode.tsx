import React, { useState, useEffect } from 'react'
import { Handle, Position, NodeToolbar } from '@xyflow/react'
import { useCanvasStore } from '../../../state/canvasStore'
import { HoverTooltip } from '../../ui/HoverTooltip'
import { MacPopup } from '../../ui/MacPopup'

export type SnowballNodeData = {
  label: string
  parentTopic?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SnowballNode = React.memo((props: any) => {
  const { id, data } = props as { id: string; data: SnowballNodeData }
  const [isHovered, setIsHovered] = useState(false)
  // Global state for popup management
  const activePopupId = useCanvasStore((state) => state.activePopupId)
  const setActivePopup = useCanvasStore((state) => state.setActivePopup)

  const showPopup = activePopupId === id

  // Select individual slices for performance
  const expandNode = useCanvasStore((state) => state.expandNode)
  const fetchFunFact = useCanvasStore((state) => state.fetchFunFact)
  const clearHoveredFact = useCanvasStore((state) => state.clearHoveredFact)
  const isExpanding = useCanvasStore((state) => state.isExpanding)
  const expandingNodeId = useCanvasStore((state) => state.expandingNodeId)
  const expandedNodeIds = useCanvasStore((state) => state.expandedNodeIds)
  const learnedNodeIds = useCanvasStore((state) => state.learnedNodeIds)
  const hoveredFact = useCanvasStore((state) => state.hoveredFact)
  const isLoadingFact = useCanvasStore((state) => state.isLoadingFact)
  const gameMode = useCanvasStore((state) => state.gameMode)
  const edges = useCanvasStore((state) => state.edges)

  const isThisNodeExpanding = isExpanding && expandingNodeId === id
  // Check if this node has children by looking at edges where this node is the source
  const hasChildren = edges.some((edge) => edge.source === id)
  const isExpanded = expandedNodeIds.includes(id) || hasChildren
  const isLearned = learnedNodeIds.includes(id)

  // Get the fact for this node
  const currentFact = hoveredFact?.nodeId === id ? hoveredFact.fact : null

  // Handle click to show popup (for unexpanded nodes)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Allow opening popup even for learned nodes to review
    if (!isExpanding && !showPopup && gameMode === 'peace') {
      setActivePopup(id)
      setIsHovered(false)
      // Fetch the fact when opening popup
      fetchFunFact(id, data.label)
    }
  }

  // Handle expand from popup
  const handleExpand = () => {
    setActivePopup(null)
    clearHoveredFact()
    expandNode(id, data.label)
  }

  // Handle close popup
  const handleClosePopup = () => {
    setActivePopup(null)
    clearHoveredFact()
  }

  // Handle hover
  const handleMouseEnter = () => {
    if (!showPopup && !isExpanded && gameMode === 'peace') {
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
    if (gameMode !== 'peace') return 'default'
    if (isThisNodeExpanding) return 'wait'
    return 'pointer'
  }

  // Get node styling based on state - frosted glass aesthetic
  const getNodeStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      cursor: getCursor(),
      transition: 'all 0.25s ease',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }

    if (isThisNodeExpanding) {
      return {
        ...base,
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 0 20px 4px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
      }
    }

    if (isLearned) {
      return {
        ...base,
        background: 'rgba(251, 191, 36, 0.12)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        boxShadow: isHovered
          ? '0 0 24px 6px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 0 14px 3px rgba(251, 191, 36, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
        transform: isHovered && !isExpanded ? 'scale(1.05)' : undefined,
      }
    }

    if (isExpanded) {
      return {
        ...base,
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 0 12px 2px rgba(148, 163, 184, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
      }
    }

    // Default unexpanded, unlearned state
    return {
      ...base,
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: isHovered
        ? '0 0 20px 4px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
        : '0 0 10px 2px rgba(148, 163, 184, 0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
      transform: isHovered ? 'scale(1.05)' : undefined,
    }
  }

  return (
    <div
      className={`relative rounded-2xl px-5 py-3 text-sm font-body ${isThisNodeExpanding ? 'animate-node-loading-pulse' : ''
        } ${!isThisNodeExpanding && !isExpanded ? 'animate-node-pulse' : ''}`}
      style={getNodeStyle()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1.5 !h-1.5 !bg-white/30 !border-0"
      />

      {/* Node label */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          {isLearned && (
            <span className="text-amber-300 text-xs">&#10003;</span>
          )}
          <span className={`${isLearned ? 'text-amber-200' : 'text-slate-100'} drop-shadow-sm`}>
            {data.label}
          </span>
        </div>
      </div>

      {/* Expand indicator for unexpanded nodes */}
      {!isExpanded && !isThisNodeExpanding && !showPopup && !isLearned && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white/60"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
          }}
        >
          +
        </div>
      )}

      {/* Learned indicator */}
      {isLearned && !isExpanded && !showPopup && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-amber-300"
          style={{
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.3)',
          }}
        >
          &#10003;
        </div>
      )}

      {/* Hover tooltip - simple "Click to learn more!" */}
      {isHovered && !showPopup && !isExpanded && (
        <HoverTooltip />
      )}

      {/* macOS-style popup with fun fact, wrapped in NodeToolbar for z-index management */}
      <NodeToolbar isVisible={showPopup} position={Position.Bottom} align="center">
        <MacPopup
          nodeId={id}
          title={data.label}
          content={currentFact || 'Loading...'}
          isLoading={isLoadingFact}
          isLearned={isLearned}
          isExpanded={isExpanded}
          onClose={handleClosePopup}
          onExpand={handleExpand}
        />
      </NodeToolbar>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1.5 !h-1.5 !bg-white/30 !border-0"
      />
    </div>
  )
})

SnowballNode.displayName = 'SnowballNode'

export default SnowballNode

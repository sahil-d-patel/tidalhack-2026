import { type EdgeProps, getBezierPath } from '@xyflow/react'

export default function FootprintEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })

  const edgeId = `edge-glow-${props.id}`

  return (
    <>
      <defs>
        <filter id={edgeId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(251, 191, 36, 0.12)"
        strokeWidth={6}
        filter={`url(#${edgeId})`}
      />
      {/* Main line */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </>
  )
}

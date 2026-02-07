import { BaseEdge, type EdgeProps, getBezierPath } from '@xyflow/react'

export default function FootprintEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: '8,6',
        strokeLinecap: 'round',
      }}
    />
  )
}

import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCanvasStore } from '../../state/canvasStore'
import SnowballNode from './nodes/SnowballNode'
import FootprintEdge from './edges/FootprintEdge'

// Define nodeTypes and edgeTypes OUTSIDE component to prevent re-render warnings
const nodeTypes = {
  snowball: SnowballNode,
}

const edgeTypes = {
  footprint: FootprintEdge,
}

export default function InfiniteCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useCanvasStore()

  return (
    <div className="absolute inset-0" style={{ zIndex: 'var(--z-canvas)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.1}
        maxZoom={4}
      >
        <Background color="#334155" gap={40} size={1} style={{ opacity: 0.3 }} />
        <Controls className="!bg-background-light/80 !border-slate-600 !shadow-lg" />
      </ReactFlow>
    </div>
  )
}

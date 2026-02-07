import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

const SnowballNode = React.memo(({ data }: NodeProps) => {
  return (
    <div
      className="relative rounded-2xl bg-white/90 px-5 py-3 border border-slate-200/50
                 text-slate-700 font-body text-sm hover:scale-105 hover:shadow-lg
                 transition-all duration-200"
      style={{
        boxShadow: 'inset 0 2px 8px rgba(191,219,254,0.3)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-slate-300 opacity-50"
      />
      {data.label}
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

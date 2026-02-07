import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react'

// Seed data: Tree structure of The Universe and its branches
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'snowball',
    position: { x: 400, y: 50 },
    data: { label: 'The Universe' },
  },
  {
    id: '2',
    type: 'snowball',
    position: { x: 200, y: 200 },
    data: { label: 'Galaxies' },
  },
  {
    id: '3',
    type: 'snowball',
    position: { x: 600, y: 200 },
    data: { label: 'Dark Matter' },
  },
  {
    id: '4',
    type: 'snowball',
    position: { x: 100, y: 350 },
    data: { label: 'Milky Way' },
  },
  {
    id: '5',
    type: 'snowball',
    position: { x: 300, y: 350 },
    data: { label: 'Andromeda' },
  },
  {
    id: '6',
    type: 'snowball',
    position: { x: 500, y: 350 },
    data: { label: 'WIMPs' },
  },
  {
    id: '7',
    type: 'snowball',
    position: { x: 700, y: 350 },
    data: { label: 'Gravitational Lensing' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'footprint' },
  { id: 'e1-3', source: '1', target: '3', type: 'footprint' },
  { id: 'e2-4', source: '2', target: '4', type: 'footprint' },
  { id: 'e2-5', source: '2', target: '5', type: 'footprint' },
  { id: 'e3-6', source: '3', target: '6', type: 'footprint' },
  { id: 'e3-7', source: '3', target: '7', type: 'footprint' },
]

type CanvasStore = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
}))

import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react'
import { API_BASE, DEMO_DATA, type SubTopic, type QuizData } from '../config/api'

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

  // AI interaction state
  isExpanding: boolean
  expandingNodeId: string | null
  hoveredFact: { nodeId: string; fact: string } | null
  isLoadingFact: boolean
  demoMode: boolean
  error: string | null
  expandedNodeIds: string[] // Zustand serializes Set as array

  // Blizzard Mode state
  gameMode: 'peace' | 'blizzard'
  blizzardQuiz: { nodeId: string; topic: string; quiz: QuizData; questionIndex: number } | null
  warmth: number
  quizResult: 'correct' | 'wrong' | null
  blizzardComplete: boolean

  // Sound state
  soundMuted: boolean

  // Actions
  toggleDemoMode: () => void
  toggleSound: () => void
  expandNode: (nodeId: string, topic: string) => Promise<void>
  fetchFunFact: (nodeId: string, topic: string) => Promise<void>
  clearHoveredFact: () => void
  enterBlizzard: (nodeId: string, topic: string, quiz: QuizData) => void
  answerQuiz: (selectedIndex: number) => void
  exitBlizzard: () => void
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

  // State
  isExpanding: false,
  expandingNodeId: null,
  hoveredFact: null,
  isLoadingFact: false,
  demoMode: false,
  error: null,
  expandedNodeIds: [],

  // Blizzard Mode state
  gameMode: 'peace',
  blizzardQuiz: null,
  warmth: 50,
  quizResult: null,
  blizzardComplete: false,

  // Sound state
  soundMuted: true,

  // Toggle demo mode
  toggleDemoMode: () => {
    set((state) => ({ demoMode: !state.demoMode }))
  },

  // Toggle sound
  toggleSound: () => {
    set((state) => ({ soundMuted: !state.soundMuted }))
  },

  // Expand node to show 4 child sub-topics
  expandNode: async (nodeId: string, topic: string) => {
    const { expandedNodeIds, nodes, edges, demoMode } = get()

    // Prevent double-expand
    if (expandedNodeIds.includes(nodeId)) {
      return
    }

    set({ isExpanding: true, expandingNodeId: nodeId, error: null })

    try {
      let subTopics: SubTopic[]

      if (demoMode) {
        // Use pre-cached demo data
        const demoData = DEMO_DATA[topic]
        if (!demoData) {
          throw new Error(`No demo data found for topic: ${topic}`)
        }
        subTopics = demoData.subTopics
      } else {
        // Fetch from live API
        const response = await fetch(`${API_BASE}/scout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        subTopics = data.data.subTopics
      }

      // Find parent node position
      const parentNode = nodes.find((n) => n.id === nodeId)
      if (!parentNode) {
        throw new Error(`Parent node ${nodeId} not found`)
      }

      const parentX = parentNode.position.x
      const parentY = parentNode.position.y

      // Generate new nodes and edges
      const newNodes: Node[] = subTopics.map((subTopic, i) => ({
        id: `${nodeId}-${i}`,
        type: 'snowball',
        position: {
          x: parentX + (i - 1.5) * 200,
          y: parentY + 180,
        },
        data: {
          label: subTopic.label,
          quiz: subTopic.quiz,
          parentTopic: topic,
        },
      }))

      const newEdges: Edge[] = subTopics.map((_, i) => ({
        id: `e${nodeId}-${nodeId}-${i}`,
        source: nodeId,
        target: `${nodeId}-${i}`,
        type: 'footprint',
      }))

      // Append to existing nodes/edges
      set({
        nodes: [...nodes, ...newNodes],
        edges: [...edges, ...newEdges],
        expandedNodeIds: [...expandedNodeIds, nodeId],
        isExpanding: false,
        expandingNodeId: null,
      })
    } catch (error) {
      console.error('Error expanding node:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to expand node',
        isExpanding: false,
        expandingNodeId: null,
      })
    }
  },

  // Fetch fun fact for hovered node
  fetchFunFact: async (nodeId: string, topic: string) => {
    const { demoMode } = get()

    set({ isLoadingFact: true })

    try {
      let funFact: string

      if (demoMode) {
        // Use pre-cached demo data
        const demoData = DEMO_DATA[topic]
        if (demoData) {
          funFact = demoData.funFact
        } else {
          funFact = 'Explore this fascinating topic by clicking to expand!'
        }
      } else {
        // Fetch from live API
        const response = await fetch(`${API_BASE}/hover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        funFact = data.data.funFact
      }

      set({
        hoveredFact: { nodeId, fact: funFact },
        isLoadingFact: false,
      })
    } catch (error) {
      console.error('Error fetching fun fact:', error)
      set({
        hoveredFact: {
          nodeId,
          fact: 'Click to explore this topic further!',
        },
        isLoadingFact: false,
      })
    }
  },

  // Clear hovered fact tooltip
  clearHoveredFact: () => {
    set({ hoveredFact: null })
  },

  // Enter Blizzard Mode
  enterBlizzard: (nodeId: string, topic: string, quiz: QuizData) => {
    set({
      gameMode: 'blizzard',
      blizzardQuiz: { nodeId, topic, quiz, questionIndex: 0 },
      warmth: 50,
      blizzardComplete: false,
      quizResult: null,
    })
  },

  // Answer quiz question
  answerQuiz: (selectedIndex: number) => {
    const { blizzardQuiz, warmth } = get()

    if (!blizzardQuiz) return

    const isCorrect = selectedIndex === blizzardQuiz.quiz.correctIndex
    const newWarmth = isCorrect
      ? Math.min(100, warmth + 25)
      : Math.max(0, warmth - 30)

    set({
      warmth: newWarmth,
      quizResult: isCorrect ? 'correct' : 'wrong',
      blizzardComplete: true,
    })

    // Clear quiz result after 800ms
    setTimeout(() => {
      set({ quizResult: null })
    }, 800)
  },

  // Exit Blizzard Mode
  exitBlizzard: () => {
    set({
      gameMode: 'peace',
      blizzardQuiz: null,
      quizResult: null,
      blizzardComplete: false,
    })
  },
}))

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

type CanvasStore = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange

  // Root topic state
  rootTopic: string | null

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
  setRootTopic: (topic: string) => void
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
  // Start with no nodes - user will set the root topic
  nodes: [],
  edges: [],
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

  // Root topic - null until user sets it
  rootTopic: null,

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

  // Set the root topic and create the initial node
  setRootTopic: (topic: string) => {
    const rootNode: Node = {
      id: 'root',
      type: 'snowball',
      position: { x: 400, y: 50 },
      data: { label: topic },
    }
    set({
      rootTopic: topic,
      nodes: [rootNode],
      edges: [],
      expandedNodeIds: [],
    })
  },

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

      // Layout constants
      const NODE_WIDTH = 200 // Approximate width of a node
      const HORIZONTAL_SPACING = 50 // Gap between nodes
      const VERTICAL_SPACING = 180 // Vertical distance between levels

      // Build a map of parent-child relationships from edges
      const childrenMap = new Map<string, string[]>()
      edges.forEach((edge) => {
        const children = childrenMap.get(edge.source) || []
        children.push(edge.target)
        childrenMap.set(edge.source, children)
      })

      // Function to calculate the total width required for a subtree
      const getSubtreeWidth = (nodeId: string, allNodes: Node[]): number => {
        const children = childrenMap.get(nodeId) || []
        if (children.length === 0) {
          return NODE_WIDTH
        }

        // Sum of all children's subtree widths plus spacing between them
        let totalWidth = 0
        children.forEach((childId, index) => {
          totalWidth += getSubtreeWidth(childId, allNodes)
          if (index < children.length - 1) {
            totalWidth += HORIZONTAL_SPACING
          }
        })

        return Math.max(NODE_WIDTH, totalWidth)
      }

      // Calculate the total width needed for new children
      const numChildren = subTopics.length
      const totalChildrenWidth = numChildren * NODE_WIDTH + (numChildren - 1) * HORIZONTAL_SPACING

      // Find all existing nodes at the target Y level
      const targetY = parentY + VERTICAL_SPACING
      const nodesAtTargetLevel = nodes.filter(
        (n) => Math.abs(n.position.y - targetY) < VERTICAL_SPACING / 2
      )

      // Calculate bounding box of existing nodes at this level
      let minX = Infinity
      let maxX = -Infinity
      nodesAtTargetLevel.forEach((n) => {
        minX = Math.min(minX, n.position.x - NODE_WIDTH / 2)
        maxX = Math.max(maxX, n.position.x + NODE_WIDTH / 2)
      })

      // Determine the starting X position for new children
      // Center them under the parent, but check for overlaps
      let startX = parentX - totalChildrenWidth / 2 + NODE_WIDTH / 2

      // Check if the new children would overlap with existing nodes
      const proposedMinX = startX - NODE_WIDTH / 2
      const proposedMaxX = startX + totalChildrenWidth - NODE_WIDTH / 2

      if (nodesAtTargetLevel.length > 0) {
        // Check for overlap
        const hasLeftOverlap = proposedMinX < maxX + HORIZONTAL_SPACING && proposedMinX > minX - NODE_WIDTH
        const hasRightOverlap = proposedMaxX > minX - HORIZONTAL_SPACING && proposedMaxX < maxX + NODE_WIDTH
        const isContained = proposedMinX >= minX && proposedMaxX <= maxX

        if (hasLeftOverlap || hasRightOverlap || isContained) {
          // Find a gap or place to the right
          // Simple strategy: place to the right of all existing nodes
          if (parentX > (maxX + minX) / 2) {
            // Parent is on the right side, place children further right
            startX = maxX + HORIZONTAL_SPACING + NODE_WIDTH / 2
          } else {
            // Parent is on the left side, place children further left
            startX = minX - totalChildrenWidth - HORIZONTAL_SPACING + NODE_WIDTH / 2
          }
        }
      }

      // Generate new nodes with calculated positions
      const newNodes: Node[] = subTopics.map((subTopic, i) => ({
        id: `${nodeId}-${i}`,
        type: 'snowball',
        position: {
          x: startX + i * (NODE_WIDTH + HORIZONTAL_SPACING),
          y: targetY,
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

      // After adding new nodes, we need to relayout the entire tree to prevent overlaps
      const allNodes = [...nodes, ...newNodes]
      const allEdges = [...edges, ...newEdges]

      // Rebuild children map with new edges
      const newChildrenMap = new Map<string, string[]>()
      allEdges.forEach((edge) => {
        const children = newChildrenMap.get(edge.source) || []
        children.push(edge.target)
        newChildrenMap.set(edge.source, children)
      })

      // Find root node (node with no incoming edges)
      const targetNodes = new Set(allEdges.map((e) => e.target))
      const rootNodes = allNodes.filter((n) => !targetNodes.has(n.id))

      // Recursive function to calculate subtree width
      const calcSubtreeWidth = (nodeId: string): number => {
        const children = newChildrenMap.get(nodeId) || []
        if (children.length === 0) {
          return NODE_WIDTH
        }
        let totalWidth = 0
        children.forEach((childId, index) => {
          totalWidth += calcSubtreeWidth(childId)
          if (index < children.length - 1) {
            totalWidth += HORIZONTAL_SPACING
          }
        })
        return Math.max(NODE_WIDTH, totalWidth)
      }

      // Recursive function to position a subtree
      const positionSubtree = (
        nodeId: string,
        startX: number,
        y: number,
        nodeMap: Map<string, Node>
      ) => {
        const node = nodeMap.get(nodeId)
        if (!node) return

        const subtreeWidth = calcSubtreeWidth(nodeId)
        const children = newChildrenMap.get(nodeId) || []

        // Position this node at the center of its subtree
        node.position = {
          x: startX + subtreeWidth / 2 - NODE_WIDTH / 2,
          y: y,
        }

        // Position children
        if (children.length > 0) {
          let childStartX = startX
          children.forEach((childId) => {
            const childWidth = calcSubtreeWidth(childId)
            positionSubtree(childId, childStartX, y + VERTICAL_SPACING, nodeMap)
            childStartX += childWidth + HORIZONTAL_SPACING
          })
        }
      }

      // Create a node map for easy updates
      const nodeMap = new Map<string, Node>()
      allNodes.forEach((n) => nodeMap.set(n.id, { ...n }))

      // Position all trees from their roots
      let globalStartX = 0
      rootNodes.forEach((rootNode) => {
        const treeWidth = calcSubtreeWidth(rootNode.id)
        positionSubtree(rootNode.id, globalStartX, rootNode.position.y, nodeMap)
        globalStartX += treeWidth + HORIZONTAL_SPACING * 2
      })

      // Convert node map back to array
      const repositionedNodes = Array.from(nodeMap.values())

      // Append to existing nodes/edges
      set({
        nodes: repositionedNodes,
        edges: allEdges,
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

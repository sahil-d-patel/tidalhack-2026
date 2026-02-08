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

type MasteryQuizState = {
  parentNodeId: string
  parentTopic: string
  childTopics: string[]
  quizzes: QuizData[]
  currentQuestionIndex: number
  correctAnswers: number
  isLoading: boolean
}

type CanvasStore = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange

  // Root topic state
  rootTopic: string | null
  isLoadingRoot: boolean

  // AI interaction state
  isExpanding: boolean
  expandingNodeId: string | null
  hoveredFact: { nodeId: string; fact: string } | null
  isLoadingFact: boolean
  demoMode: boolean
  error: string | null
  expandedNodeIds: string[]
  learnedNodeIds: string[] // Nodes marked as "learned"

  // Blizzard Mode / Mastery Quiz state
  gameMode: 'peace' | 'blizzard'
  masteryQuiz: MasteryQuizState | null
  warmth: number
  quizResult: 'correct' | 'wrong' | null
  blizzardComplete: boolean
  isDead: boolean // Player died (warmth reached 0)

  // Legacy (keeping for compatibility)
  blizzardQuiz: { nodeId: string; topic: string; quiz: QuizData; questionIndex: number } | null

  // Sound state
  soundMuted: boolean

  // Day/Night mode
  isDayMode: boolean
  toggleDayMode: () => void

  // Actions
  setRootTopic: (topic: string) => Promise<void>
  toggleDemoMode: () => void
  toggleSound: () => void
  expandNode: (nodeId: string, topic: string) => Promise<void>
  fetchFunFact: (nodeId: string, topic: string) => Promise<void>
  clearHoveredFact: () => void
  markNodeAsLearned: (nodeId: string) => void
  checkAndStartMasteryQuiz: (parentNodeId: string) => void
  answerMasteryQuiz: (selectedIndex: number) => void
  retryQuiz: () => void  // Retry after death
  exitBlizzard: () => void

  // Legacy
  enterBlizzard: (nodeId: string, topic: string, quiz: QuizData) => void
  answerQuiz: (selectedIndex: number) => void

  // UI Actions
  activePopupId: string | null
  isConceptsListOpen: boolean
  setActivePopup: (nodeId: string | null) => void
  toggleConceptsList: () => void
  openConcept: (topic: string) => Promise<void>
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
  learnedNodeIds: [],

  // Blizzard Mode / Mastery Quiz state
  gameMode: 'peace',
  masteryQuiz: null,
  blizzardQuiz: null, // Legacy
  warmth: 50,
  quizResult: null,
  blizzardComplete: false,
  isDead: false,

  // Sound state
  soundMuted: true,
  isLoadingRoot: false,

  // Day/Night mode
  isDayMode: false,
  toggleDayMode: () => {
    set((state) => ({ isDayMode: !state.isDayMode }))
  },

  // UI State
  activePopupId: null,
  isConceptsListOpen: false,

  setActivePopup: (nodeId: string | null) => {
    set({ activePopupId: nodeId })
  },

  toggleConceptsList: () => {
    set((state) => ({ isConceptsListOpen: !state.isConceptsListOpen }))
  },

  // Set the root topic and create the initial node
  setRootTopic: async (topic: string) => {
    const { demoMode } = get()

    // Set loading state
    set({ isLoadingRoot: true })

    try {
      let funFact: string

      if (demoMode) {
        const demoData = DEMO_DATA[topic]
        if (demoData?.funFact) {
          funFact = demoData.funFact
        } else {
          // Fallback demo fun fact
          funFact = 'Explore this fascinating topic by clicking to expand to see more details!'
        }
        // Simulate loading delay for realism in demo mode
        await new Promise(resolve => setTimeout(resolve, 800))
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

      const rootNode: Node = {
        id: 'root',
        type: 'snowball',
        position: { x: 400, y: 50 },
        data: { label: topic, funFact },
      }

      set({
        rootTopic: topic,
        nodes: [rootNode],
        edges: [],
        expandedNodeIds: [],
        learnedNodeIds: [],
        masteryQuiz: null,
        gameMode: 'peace',
        isLoadingRoot: false,
      })
    } catch (error) {
      console.error('Error fetching root topic:', error)
      // Fallback in case of error
      const rootNode: Node = {
        id: 'root',
        type: 'snowball',
        position: { x: 400, y: 50 },
        data: { label: topic, funFact: 'Click to explore this topic further!' },
      }
      set({
        rootTopic: topic,
        nodes: [rootNode],
        edges: [],
        expandedNodeIds: [],
        learnedNodeIds: [],
        masteryQuiz: null,
        gameMode: 'peace',
        isLoadingRoot: false,
      })
    }
  },

  // Open a concept from history - rebuild full previously-explored tree
  openConcept: async (topic: string) => {
    const { demoMode } = get()

    set({ isLoadingRoot: true })

    try {
      if (demoMode) {
        // In demo mode, just set root + expand one level
        await get().setRootTopic(topic)
        await get().expandNode('root', topic)
        return
      }

      // Fetch full cached tree from server
      const response = await fetch(`${API_BASE}/tree/${encodeURIComponent(topic)}`)

      if (!response.ok) {
        // Fallback to simple root + expand
        await get().setRootTopic(topic)
        await get().expandNode('root', topic)
        return
      }

      const { data: tree } = await response.json()

      // Layout constants
      const NODE_WIDTH = 200
      const HORIZONTAL_SPACING = 50
      const VERTICAL_SPACING = 180

      // Recursively build flat node/edge arrays from tree
      const nodes: Node[] = []
      const edges: Edge[] = []
      const expandedNodeIds: string[] = []

      const buildNodesFromTree = (
        treeNode: { label: string; funFact: string; quiz: any; children: any[] },
        nodeId: string,
        parentTopic?: string
      ) => {
        nodes.push({
          id: nodeId,
          type: 'snowball',
          position: { x: 0, y: 0 }, // will be repositioned
          data: {
            label: treeNode.label,
            funFact: treeNode.funFact || '',
            quiz: treeNode.quiz,
            parentTopic,
          },
        })

        if (treeNode.children && treeNode.children.length > 0) {
          expandedNodeIds.push(nodeId)

          treeNode.children.forEach((child: any, i: number) => {
            const childId = `${nodeId}-${i}`
            edges.push({
              id: `e${nodeId}-${childId}`,
              source: nodeId,
              target: childId,
              type: 'footprint',
            })
            buildNodesFromTree(child, childId, treeNode.label)
          })
        }
      }

      buildNodesFromTree(tree, 'root')

      // Build children map for layout
      const childrenMap = new Map<string, string[]>()
      edges.forEach((edge) => {
        const children = childrenMap.get(edge.source) || []
        children.push(edge.target)
        childrenMap.set(edge.source, children)
      })

      // Calculate subtree widths
      const calcSubtreeWidth = (nodeId: string): number => {
        const children = childrenMap.get(nodeId) || []
        if (children.length === 0) return NODE_WIDTH
        let totalWidth = 0
        children.forEach((childId, index) => {
          totalWidth += calcSubtreeWidth(childId)
          if (index < children.length - 1) totalWidth += HORIZONTAL_SPACING
        })
        return Math.max(NODE_WIDTH, totalWidth)
      }

      // Position subtrees
      const nodeMap = new Map<string, Node>()
      nodes.forEach((n) => nodeMap.set(n.id, n))

      const positionSubtree = (nodeId: string, startX: number, y: number) => {
        const node = nodeMap.get(nodeId)
        if (!node) return

        const subtreeWidth = calcSubtreeWidth(nodeId)
        const children = childrenMap.get(nodeId) || []

        node.position = {
          x: startX + subtreeWidth / 2 - NODE_WIDTH / 2,
          y,
        }

        if (children.length > 0) {
          let childStartX = startX
          children.forEach((childId) => {
            const childWidth = calcSubtreeWidth(childId)
            positionSubtree(childId, childStartX, y + VERTICAL_SPACING)
            childStartX += childWidth + HORIZONTAL_SPACING
          })
        }
      }

      positionSubtree('root', 0, 50)

      set({
        rootTopic: topic,
        nodes,
        edges,
        expandedNodeIds,
        learnedNodeIds: [],
        masteryQuiz: null,
        gameMode: 'peace',
        isLoadingRoot: false,
      })
    } catch (error) {
      console.error('Error loading tree:', error)
      // Fallback
      await get().setRootTopic(topic)
      await get().expandNode('root', topic)
    }
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

      // Generate new nodes with calculated positions (including pre-loaded fun facts)
      const newNodes: Node[] = subTopics.map((subTopic, i) => ({
        id: `${nodeId}-${i}`,
        type: 'snowball',
        position: {
          x: startX + i * (NODE_WIDTH + HORIZONTAL_SPACING),
          y: targetY,
        },
        data: {
          label: subTopic.label,
          funFact: subTopic.funFact,
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
    const { nodes, demoMode } = get()

    // Check if we already have the fact on the node data
    const node = nodes.find((n) => n.id === nodeId)
    if (node?.data?.funFact) {
      set({
        hoveredFact: { nodeId, fact: node.data.funFact as string },
        isLoadingFact: false,
      })
      return
    }

    set({ isLoadingFact: true })

    try {
      let funFact: string

      if (demoMode) {
        // Use pre-cached demo data logic (fallback for root mostly)
        // Note: Individual nodes usually have funFact in data now
        funFact = 'Explore this fascinating topic by clicking to expand to see more details!'

        // Try to find if this is a subtopic we know about
        // (This is a basic fallback search)
        for (const key in DEMO_DATA) {
          const sub = DEMO_DATA[key].subTopics.find(s => s.label === topic)
          if (sub?.funFact) {
            funFact = sub.funFact
            break
          }
        }
      } else {
        // Fetch from live API (fallback for root node or legacy)
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

        // Store it so we don't fetch again
        set({
          nodes: nodes.map(n =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, funFact } }
              : n
          )
        })
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

  // Mark a node as learned (turns green)
  // Also marks all children recursively as learned
  markNodeAsLearned: (nodeId: string) => {
    const { learnedNodeIds, nodes, edges } = get()

    if (learnedNodeIds.includes(nodeId)) return

    // Helper function to get all descendant node IDs recursively
    const getAllDescendants = (parentId: string): string[] => {
      const childEdges = edges.filter(e => e.source === parentId)
      const childIds = childEdges.map(e => e.target)

      let allDescendants: string[] = [...childIds]
      for (const childId of childIds) {
        allDescendants = [...allDescendants, ...getAllDescendants(childId)]
      }
      return allDescendants
    }

    // Get all descendants of this node
    const descendants = getAllDescendants(nodeId)

    // Mark this node and all descendants as learned
    const nodesToMark = [nodeId, ...descendants]
    const newLearnedNodeIds = [...learnedNodeIds]

    for (const id of nodesToMark) {
      if (!newLearnedNodeIds.includes(id)) {
        newLearnedNodeIds.push(id)
      }
    }

    set({ learnedNodeIds: newLearnedNodeIds })

    console.log(`[Learn] Marked ${nodesToMark.length} node(s) as learned (${nodeId} + ${descendants.length} children)`)

    // Check if this is the ROOT node being marked as learned
    // Only the root node triggers the mastery quiz
    if (nodeId === 'root') {
      console.log('[Quiz] Root node marked as learned - starting mastery quiz!')

      // Get all learned child topics for the quiz
      const childEdges = edges.filter(e => e.source === 'root')
      const childTopics = childEdges.map(e => {
        const node = nodes.find(n => n.id === e.target)
        return node?.data?.label as string
      }).filter(Boolean)

      if (childTopics.length > 0) {
        // Start mastery quiz after a short delay
        setTimeout(() => {
          get().checkAndStartMasteryQuiz('root')
        }, 500)
      }
    }
    // For non-root nodes, just mark as learned without triggering quiz
  },

  // Check and start mastery quiz for a parent node
  checkAndStartMasteryQuiz: async (parentNodeId: string) => {
    const { nodes, edges, demoMode, rootTopic } = get()

    const parentNode = nodes.find(n => n.id === parentNodeId)
    if (!parentNode) return

    const parentTopic = parentNode.data.label as string
    const siblingEdges = edges.filter(e => e.source === parentNodeId)
    const childTopics = siblingEdges.map(e => {
      const node = nodes.find(n => n.id === e.target)
      return node?.data?.label as string
    }).filter(Boolean)

    console.log(`[Mastery Quiz] Starting quiz for "${parentTopic}" with children:`, childTopics)

    // Start loading state
    set({
      gameMode: 'blizzard',
      masteryQuiz: {
        parentNodeId,
        parentTopic,
        childTopics,
        quizzes: [],
        currentQuestionIndex: 0,
        correctAnswers: 0,
        isLoading: true,
      },
      warmth: 50,
      blizzardComplete: false,
      quizResult: null,
    })

    try {
      let quizzes: QuizData[] = []

      if (demoMode) {
        // Use demo quizzes
        const demoQuizzes: QuizData[] = []
        const allTopics = [parentTopic, ...childTopics]

        for (const topic of allTopics) {
          const demoData = DEMO_DATA[topic]
          if (demoData?.subTopics) {
            const topicQuiz = demoData.subTopics.find(st => st.quiz)?.quiz
            if (topicQuiz) {
              demoQuizzes.push(topicQuiz)
            }
          }
        }

        // Create fallback quizzes if needed
        while (demoQuizzes.length < 5) {
          demoQuizzes.push({
            question: `What have you learned about ${allTopics[demoQuizzes.length % allTopics.length]}?`,
            options: ['Everything!', 'A lot', 'Some things', 'I need to review'],
            correctIndex: 0,
          })
        }

        quizzes = demoQuizzes.slice(0, 5)
      } else {
        // Fetch from API
        const response = await fetch(`${API_BASE}/mastery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: parentTopic, childTopics, rootTopic }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        quizzes = data.data.quizzes
      }

      set(state => ({
        masteryQuiz: state.masteryQuiz ? {
          ...state.masteryQuiz,
          quizzes,
          isLoading: false,
        } : null,
      }))
    } catch (error) {
      console.error('Error fetching mastery quiz:', error)
      // Exit blizzard mode on error
      set({
        gameMode: 'peace',
        masteryQuiz: null,
        error: 'Failed to load mastery quiz',
      })
    }
  },

  // Answer a mastery quiz question
  answerMasteryQuiz: (selectedIndex: number) => {
    const { masteryQuiz, warmth } = get()

    if (!masteryQuiz || masteryQuiz.isLoading) return

    const currentQuiz = masteryQuiz.quizzes[masteryQuiz.currentQuestionIndex]
    if (!currentQuiz) return

    const isCorrect = selectedIndex === currentQuiz.correctIndex
    const newWarmth = isCorrect
      ? Math.min(100, warmth + 15)
      : Math.max(0, warmth - 15)
    const newCorrectAnswers = isCorrect
      ? masteryQuiz.correctAnswers + 1
      : masteryQuiz.correctAnswers

    set({
      warmth: newWarmth,
      quizResult: isCorrect ? 'correct' : 'wrong',
    })

    // Check if player died (warmth reached 0)
    if (newWarmth === 0) {
      console.log('[Quiz] Player died! Warmth reached 0')
      setTimeout(() => {
        set({
          isDead: true,
          quizResult: null,
        })
      }, 1000)
      return
    }

    // Move to next question or complete after delay
    setTimeout(() => {
      const nextIndex = masteryQuiz.currentQuestionIndex + 1

      if (nextIndex >= masteryQuiz.quizzes.length) {
        // Quiz complete!
        set({
          blizzardComplete: true,
          quizResult: null,
          masteryQuiz: {
            ...masteryQuiz,
            correctAnswers: newCorrectAnswers,
            currentQuestionIndex: nextIndex,
          },
        })
      } else {
        // Next question
        set({
          quizResult: null,
          masteryQuiz: {
            ...masteryQuiz,
            currentQuestionIndex: nextIndex,
            correctAnswers: newCorrectAnswers,
          },
        })
      }
    }, 1000)
  },

  // Retry quiz after death
  retryQuiz: () => {
    const { masteryQuiz } = get()

    if (!masteryQuiz) return

    console.log('[Quiz] Retrying quiz after death')

    // Reset the quiz to the beginning
    set({
      isDead: false,
      warmth: 50,
      quizResult: null,
      blizzardComplete: false,
      masteryQuiz: {
        ...masteryQuiz,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        isLoading: false,
      },
    })
  },

  // Enter Blizzard Mode (Legacy)
  enterBlizzard: (nodeId: string, topic: string, quiz: QuizData) => {
    set({
      gameMode: 'blizzard',
      blizzardQuiz: { nodeId, topic, quiz, questionIndex: 0 },
      warmth: 50,
      blizzardComplete: false,
      quizResult: null,
    })
  },

  // Answer quiz question (Legacy)
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
      masteryQuiz: null,
      quizResult: null,
      blizzardComplete: false,
      isDead: false,
    })
  },
}))


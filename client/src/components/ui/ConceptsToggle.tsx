import { useCanvasStore } from '../../state/canvasStore'

export function ConceptsToggle() {
    const isConceptsListOpen = useCanvasStore((state) => state.isConceptsListOpen)
    const toggleConceptsList = useCanvasStore((state) => state.toggleConceptsList)

    return (
        <button
            onClick={toggleConceptsList}
            className={`frosted-glass rounded-lg px-3 py-1.5 transition-colors text-sm font-body flex items-center gap-1.5 ${isConceptsListOpen ? 'text-accent-warm hover:text-accent-warm/80' : 'text-frost/60 hover:text-frost'
                }`}
            aria-label="View Learned Concepts"
            title="View Learned Concepts"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
            </svg>
            <span className="text-xs font-medium">History</span>
        </button>
    )
}

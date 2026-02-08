import { useEffect, useState } from 'react'
import { useCanvasStore } from '../../state/canvasStore'
import { API_BASE } from '../../config/api'

export function ConceptsList() {
    const isConceptsListOpen = useCanvasStore((state) => state.isConceptsListOpen)
    const toggleConceptsList = useCanvasStore((state) => state.toggleConceptsList)
    const openConcept = useCanvasStore((state) => state.openConcept)
    const [concepts, setConcepts] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isConceptsListOpen) {
            fetchConcepts()
        }
    }, [isConceptsListOpen])

    const fetchConcepts = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${API_BASE}/concepts`)
            if (res.ok) {
                const data = await res.json()
                setConcepts(data.data.concepts || [])
            }
        } catch (err) {
            console.error('Failed to fetch concepts:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConceptClick = (concept: string) => {
        console.log('Loading tree for:', concept)
        openConcept(concept)
        toggleConceptsList()
    }

    if (!isConceptsListOpen) return null

    return (
        <div
            className="fixed top-20 right-8 w-72 max-h-[calc(100vh-140px)] overflow-y-auto 
                 bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow-2xl 
                 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar"
            style={{ zIndex: 50 }}
        >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="text-md font-heading font-bold text-slate-200 flex items-center gap-2">
                    Concepts
                </h3>
                <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
                    {concepts.length}
                </span>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-warm"></div>
                </div>
            ) : concepts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">
                        No concepts yet.
                    </p>
                    <p className="text-slate-600 text-xs mt-1">
                        Start exploring to add concepts!
                    </p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {concepts.map((concept, index) => (
                        <li
                            key={index}
                            className="group cursor-pointer"
                            onClick={() => handleConceptClick(concept)}
                        >
                            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-600/30">
                                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] border border-indigo-500/30">
                                    ★
                                </div>
                                <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors line-clamp-1">
                                    {concept}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

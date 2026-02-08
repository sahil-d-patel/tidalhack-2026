import { useState, useEffect } from 'react'
import { useCanvasStore } from '../../state/canvasStore'

type MacPopupProps = {
    nodeId: string
    title: string
    content: string
    isLoading: boolean
    isLearned: boolean
    isExpanded: boolean
    onClose: () => void
    onExpand: () => void
}

export function MacPopup({ nodeId, title, content, isLoading, isLearned, isExpanded, onClose, onExpand }: MacPopupProps) {
    const [isVisible, setIsVisible] = useState(false)
    const markNodeAsLearned = useCanvasStore((state) => state.markNodeAsLearned)

    // Animate in on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10)
        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 200) // Wait for animation to finish
    }

    const handleExpand = () => {
        setIsVisible(false)
        setTimeout(onExpand, 200) // Wait for animation to finish
    }

    const handleMarkAsLearned = () => {
        markNodeAsLearned(nodeId)
        setIsVisible(false)
        setTimeout(onClose, 200)
    }

    return (
        <div
            className={`absolute z-50 transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            style={{
                top: '100%',
                left: '50%',
                transform: `translateX(-50%) ${isVisible ? 'translateY(8px)' : 'translateY(0)'}`,
                minWidth: '280px',
                maxWidth: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* macOS-style window */}
            <div className="rounded-lg overflow-hidden shadow-2xl border border-slate-600/50">
                {/* Title bar */}
                <div
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-slate-700 to-slate-800"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                    {/* Traffic light buttons */}
                    <button
                        onClick={handleClose}
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
                        aria-label="Close"
                    >
                        <span className="text-red-900 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            ×
                        </span>
                    </button>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50 cursor-default" />
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-50 cursor-default" />

                    {/* Title */}
                    <span className="ml-2 text-xs text-slate-300 font-medium truncate flex-1 text-center pr-8">
                        {isLearned && '✓ '}{title}
                    </span>
                </div>

                {/* Content area */}
                <div className="bg-slate-900/95 backdrop-blur-sm px-4 py-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <span className="inline-block animate-spin text-blue-400 text-xl">❄</span>
                            <span className="ml-2 text-slate-400 text-sm">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <p className="text-slate-200 text-sm leading-relaxed mb-3">{content}</p>

                            <div className="flex flex-col gap-2">
                                {/* Mark as Learned button - only show if not already learned */}
                                {!isLearned && (
                                    <button
                                        onClick={handleMarkAsLearned}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 
                                           text-white text-sm font-medium py-2 px-4 rounded-md transition-all 
                                           shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                                    >
                                        <span>✓</span>
                                        <span>Mark as Learned</span>
                                    </button>
                                )}

                                {/* Already learned message */}
                                {isLearned && (
                                    <div className="w-full bg-emerald-600/20 border border-emerald-500/30
                                           text-emerald-400 text-sm font-medium py-2 px-4 rounded-md 
                                           flex items-center justify-center gap-2">
                                        <span>✓</span>
                                        <span>Already Learned!</span>
                                    </div>
                                )}

                                {/* Explore Topic button - only show if not already expanded */}
                                {!isExpanded && (
                                    <button
                                        onClick={handleExpand}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 
                                           text-white text-sm font-medium py-2 px-4 rounded-md transition-all 
                                           shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                    >
                                        <span>🔍</span>
                                        <span>Explore Topic</span>
                                    </button>
                                )}

                                {/* Already expanded message */}
                                {isExpanded && (
                                    <div className="w-full bg-amber-600/20 border border-amber-500/30
                                           text-amber-400 text-sm font-medium py-2 px-4 rounded-md 
                                           flex items-center justify-center gap-2">
                                        <span>🌳</span>
                                        <span>Already Expanded</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Arrow pointing up */}
            <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                style={{
                    background: 'linear-gradient(135deg, #374151 0%, #374151 50%, transparent 50%)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                }}
            />
        </div>
    )
}



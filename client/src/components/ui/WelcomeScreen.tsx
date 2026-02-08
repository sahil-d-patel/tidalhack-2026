import { useState } from 'react'
import { useCanvasStore } from '../../state/canvasStore'

export function WelcomeScreen() {
    const [topic, setTopic] = useState('')
    const setRootTopic = useCanvasStore((state) => state.setRootTopic)
    const isLoadingRoot = useCanvasStore((state) => state.isLoadingRoot)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (topic.trim()) {
            setRootTopic(topic.trim())
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setTopic(suggestion)
        setRootTopic(suggestion)
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-background-dark transition-opacity duration-500 opacity-100`}
            style={{ zIndex: 'var(--z-modal, 100)' }}
        >
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

            {/* Decorative snow particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 px-8 max-w-4xl">
                {/* Polar Bear */}
                <div className="flex-shrink-0 animate-bounce-slow">
                    <img
                        src="/polar-bear.png"
                        alt="Friendly polar bear mascot"
                        className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Text and Input */}
                <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
                    {/* Speech bubble */}
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-xl min-h-[120px] flex flex-col justify-center">
                        {isLoadingRoot ? (
                            <div className="flex flex-col items-center justify-center py-2">
                                <div className="w-8 h-8 border-4 border-blue-400 border-t-white rounded-full animate-spin mb-3"></div>
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-frost animate-pulse">
                                    Exploring the unknown...
                                </h2>
                                <p className="text-sm text-frost/60 mt-1">
                                    Finding fun facts about {topic || "this topic"}!
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-frost">
                                    What do you want to learn about?
                                </h2>
                                <p className="text-sm text-frost/60 mt-2">
                                    Enter any topic and I'll help you explore it!
                                </p>
                            </>
                        )}
                        {/* Speech bubble arrow */}
                        <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/10 border-l border-b border-white/20 rotate-45" />
                    </div>

                    {!isLoadingRoot && (
                        <>
                            {/* Input form */}
                            <form onSubmit={handleSubmit} className="w-full max-w-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="e.g., The Universe, Machine Learning, Ancient Rome..."
                                        className="w-full px-5 py-4 pr-14 bg-slate-800/80 border border-slate-600 rounded-xl
                                 text-frost placeholder-slate-500 text-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                 transition-all duration-200 shadow-lg"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!topic.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 
                                 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                                 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                                 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* Suggestions */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="text-xs text-frost/40">Try:</span>
                                {['The Universe', 'World History', 'Biology', 'Music Theory'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-3 py-1 text-xs text-frost/60 hover:text-frost bg-slate-700/50 hover:bg-slate-700 
                                 rounded-full transition-all duration-200 border border-slate-600/50"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* App branding */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <h1 className="text-xl font-heading font-bold text-accent-warm/60">
                    FRACTAL
                </h1>
            </div>
        </div>
    )
}

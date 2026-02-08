import { useState, useMemo } from 'react'
import { useCanvasStore } from '../../state/canvasStore'

export function WelcomeScreen() {
    const [topic, setTopic] = useState('')
    const setRootTopic = useCanvasStore((state) => state.setRootTopic)
    const isLoadingRoot = useCanvasStore((state) => state.isLoadingRoot)

    // Generate snowflakes once to prevent re-renders
    const snowflakes = useMemo(() =>
        [...Array(60)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 8 + Math.random() * 12,
            size: 2 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.5,
            drift: -20 + Math.random() * 40,
        }))
        , [])

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
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 opacity-100`}
            style={{ zIndex: 'var(--z-modal, 100)' }}
        >
            {/* Beautiful gradient background with aurora effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #0a0a1a 0%, #0f1428 20%, #1a1a3a 40%, #252550 60%, #1a2540 80%, #0f1428 100%)',
                }}
            />

            {/* Aurora glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[800px] h-[400px] rounded-full blur-3xl opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse, #4f46e5 0%, transparent 70%)',
                        top: '-10%',
                        left: '10%',
                    }}
                />
                <div
                    className="absolute w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)',
                        top: '20%',
                        right: '5%',
                    }}
                />
                <div
                    className="absolute w-[500px] h-[250px] rounded-full blur-3xl opacity-8"
                    style={{
                        background: 'radial-gradient(ellipse, #2563eb 0%, transparent 70%)',
                        bottom: '10%',
                        left: '20%',
                    }}
                />
            </div>

            {/* Falling snow animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <style>{`
                    @keyframes snowfall {
                        0% {
                            transform: translateY(-20px) translateX(0px) rotate(0deg);
                            opacity: 0;
                        }
                        10% {
                            opacity: var(--snow-opacity);
                        }
                        90% {
                            opacity: var(--snow-opacity);
                        }
                        100% {
                            transform: translateY(100vh) translateX(var(--snow-drift)) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `}</style>
                {snowflakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${flake.left}%`,
                            top: '-20px',
                            width: `${flake.size}px`,
                            height: `${flake.size}px`,
                            '--snow-opacity': flake.opacity,
                            '--snow-drift': `${flake.drift}px`,
                            animation: `snowfall ${flake.duration}s linear infinite`,
                            animationDelay: `${flake.delay}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Static twinkling stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            opacity: 0.2 + Math.random() * 0.4,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 px-8 max-w-5xl">
                {/* Polar Bear - LARGER */}
                <div className="flex-shrink-0 animate-bounce-slow">
                    <div className="relative">
                        {/* Glow behind bear */}
                        <div
                            className="absolute inset-0 rounded-full blur-3xl opacity-20"
                            style={{
                                background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
                                transform: 'scale(1.5)',
                            }}
                        />
                        <img
                            src="/polar-bear.png"
                            alt="Friendly polar bear mascot"
                            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Text and Input */}
                <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
                    {/* Speech bubble with glass effect */}
                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-2xl min-h-[120px] flex flex-col justify-center">
                        {isLoadingRoot ? (
                            <div className="flex flex-col items-center justify-center py-2">
                                <div className="w-10 h-10 border-4 border-blue-400 border-t-white rounded-full animate-spin mb-4"></div>
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-frost animate-pulse">
                                    Exploring the unknown...
                                </h2>
                                <p className="text-sm text-frost/60 mt-2">
                                    Finding fun facts about {topic || "this topic"}!
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-frost">
                                    What do you want to learn about?
                                </h2>
                                <p className="text-sm md:text-base text-frost/60 mt-3">
                                    Enter any topic and I'll help you explore it!
                                </p>
                            </>
                        )}
                    </div>

                    {!isLoadingRoot && (
                        <>
                            {/* Input form - enhanced */}
                            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="e.g., The Universe, Machine Learning, Ancient Rome..."
                                        className="w-full px-6 py-4 pr-14 bg-slate-800/80 backdrop-blur-sm border border-slate-500/50 rounded-xl
                                 text-frost placeholder-slate-400 text-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400
                                 transition-all duration-300 shadow-xl"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!topic.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 
                                 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                                 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                                 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
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

                            {/* Suggestions - enhanced */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="text-xs text-frost/50">Try:</span>
                                {['The Universe', 'World History', 'Biology', 'Music Theory'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-1.5 text-xs text-frost/70 hover:text-frost bg-slate-700/60 hover:bg-slate-600/80 
                                 rounded-full transition-all duration-300 border border-slate-500/40 hover:border-slate-400/60
                                 hover:scale-105 hover:shadow-lg"
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
                <h1 className="text-xl font-heading font-bold text-accent-warm/70 drop-shadow-lg">
                    FRACTAL
                </h1>
            </div>
        </div>
    )
}


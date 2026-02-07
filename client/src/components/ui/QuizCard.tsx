import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCanvasStore } from '../../state/canvasStore'

export const QuizCard = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const blizzardQuiz = useCanvasStore((state) => state.blizzardQuiz)
  const quizResult = useCanvasStore((state) => state.quizResult)
  const blizzardComplete = useCanvasStore((state) => state.blizzardComplete)
  const answerQuiz = useCanvasStore((state) => state.answerQuiz)
  const exitBlizzard = useCanvasStore((state) => state.exitBlizzard)

  if (!blizzardQuiz) return null

  const { topic, quiz } = blizzardQuiz

  const handleAnswerClick = (index: number) => {
    if (blizzardComplete) return
    setSelectedIndex(index)
    answerQuiz(index)
  }

  const handleExit = () => {
    setSelectedIndex(null)
    exitBlizzard()
  }

  return (
    <>
      {/* Answer flash overlay */}
      <AnimatePresence>
        {quizResult && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 pointer-events-none ${
              quizResult === 'correct' ? 'bg-amber-500/20' : 'bg-blue-400/20'
            }`}
            style={{ zIndex: 'var(--z-overlay)' }}
          />
        )}
      </AnimatePresence>

      {/* Quiz card */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full px-4"
        style={{ zIndex: 'var(--z-hud)' }}
      >
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600/50 rounded-2xl p-8 shadow-2xl">
          {/* Topic name */}
          <div className="text-frost/60 text-sm font-body mb-2">{topic}</div>

          {/* Question */}
          <h2 className="text-frost text-lg font-heading font-bold mb-6">
            {quiz.question}
          </h2>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {quiz.options.map((option, index) => {
              const isCorrect = index === quiz.correctIndex
              const isSelected = index === selectedIndex
              const isWrong = isSelected && !isCorrect

              let buttonClass =
                'bg-slate-700/60 hover:bg-slate-600/80 text-frost font-body text-sm px-4 py-3 rounded-xl border border-slate-500/30 transition-all'

              if (blizzardComplete) {
                if (isCorrect) {
                  buttonClass =
                    'bg-green-600/80 border-green-400 text-frost font-body text-sm px-4 py-3 rounded-xl transition-all'
                } else if (isWrong) {
                  buttonClass =
                    'bg-red-600/80 border-red-400 text-frost font-body text-sm px-4 py-3 rounded-xl transition-all'
                } else {
                  buttonClass =
                    'bg-slate-700/60 text-frost/50 font-body text-sm px-4 py-3 rounded-xl border border-slate-500/30 transition-all opacity-50'
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={blizzardComplete}
                  className={buttonClass}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {/* Return to Warmth button */}
          {blizzardComplete && (
            <button
              onClick={handleExit}
              className="w-full bg-accent-warm hover:bg-accent-heat text-slate-900 font-heading font-bold px-6 py-2 rounded-full transition-all"
            >
              Return to Warmth
            </button>
          )}
        </div>
      </div>
    </>
  )
}

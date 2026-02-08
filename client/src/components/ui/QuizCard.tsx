import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCanvasStore } from '../../state/canvasStore'

export const QuizCard = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const gameMode = useCanvasStore((state) => state.gameMode)
  const masteryQuiz = useCanvasStore((state) => state.masteryQuiz)
  const quizResult = useCanvasStore((state) => state.quizResult)
  const blizzardComplete = useCanvasStore((state) => state.blizzardComplete)
  const isDead = useCanvasStore((state) => state.isDead)
  const answerMasteryQuiz = useCanvasStore((state) => state.answerMasteryQuiz)
  const retryQuiz = useCanvasStore((state) => state.retryQuiz)
  const exitBlizzard = useCanvasStore((state) => state.exitBlizzard)

  // Reset selected index when question changes
  useEffect(() => {
    setSelectedIndex(null)
  }, [masteryQuiz?.currentQuestionIndex])

  // Don't show if not in blizzard mode or no mastery quiz
  if (gameMode !== 'blizzard' || !masteryQuiz) return null

  const { parentTopic, quizzes, currentQuestionIndex, correctAnswers, isLoading } = masteryQuiz
  const currentQuiz = quizzes[currentQuestionIndex]
  const totalQuestions = quizzes.length
  const isQuizComplete = blizzardComplete && currentQuestionIndex >= totalQuestions

  const handleAnswerClick = (index: number) => {
    if (quizResult !== null || isLoading || isDead) return
    setSelectedIndex(index)
    answerMasteryQuiz(index)
  }

  const handleExit = () => {
    setSelectedIndex(null)
    exitBlizzard()
  }

  const handleRetry = () => {
    setSelectedIndex(null)
    retryQuiz()
  }

  return (
    <>
      {/* Death screen overlay */}
      <AnimatePresence>
        {isDead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-red-900/90"
            style={{ zIndex: 9999 }}
          >
            <div className="h-full flex flex-col items-center justify-center pointer-events-auto">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-center"
              >
                <div className="text-8xl mb-6">💀</div>
                <h1 className="text-6xl font-heading font-bold text-white mb-4 tracking-wider">
                  YOU DIED!
                </h1>
                <p className="text-white/80 text-xl font-body mb-2">
                  The cold was too much to bear...
                </p>
                <p className="text-white/60 font-body mb-8">
                  Your warmth dropped to 0
                </p>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-heading font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg cursor-pointer pointer-events-auto"
                  >
                    🔄 Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExit}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-heading font-bold px-8 py-4 rounded-full text-lg transition-all cursor-pointer pointer-events-auto"
                  >
                    Exit
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer flash overlay */}
      <AnimatePresence>
        {quizResult && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 pointer-events-none ${quizResult === 'correct' ? 'bg-amber-500/20' : 'bg-blue-400/20'
              }`}
            style={{ zIndex: 'var(--z-overlay)' }}
          />
        )}
      </AnimatePresence>

      {/* Quiz card - don't show if dead */}
      {!isDead && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full px-4"
          style={{ zIndex: 'var(--z-hud)' }}
        >
          <motion.div
            className="frosted-glass rounded-2xl p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 animate-spin">❄</div>
                <h2 className="text-frost text-lg font-heading font-bold mb-2">
                  Mastery Quiz
                </h2>
                <p className="text-frost/60 text-sm font-body">
                  Preparing your quiz on "{parentTopic}"...
                </p>
              </div>
            )}

            {/* Quiz complete - show results */}
            {isQuizComplete && (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {correctAnswers >= totalQuestions * 0.8 ? '🏆' : correctAnswers >= totalQuestions * 0.5 ? '⭐' : '📚'}
                </div>
                <h2 className="text-frost text-2xl font-heading font-bold mb-2">
                  {correctAnswers >= totalQuestions * 0.8 ? 'Mastery Achieved!' :
                    correctAnswers >= totalQuestions * 0.5 ? 'Good Progress!' : 'Keep Learning!'}
                </h2>
                <p className="text-frost/80 text-lg font-body mb-4">
                  You got <span className="text-accent-warm font-bold">{correctAnswers}</span> out of{' '}
                  <span className="font-bold">{totalQuestions}</span> questions correct!
                </p>
                <p className="text-frost/60 text-sm font-body mb-6">
                  Topic: {parentTopic}
                </p>
                <button
                  onClick={handleExit}
                  className="w-full bg-accent-warm hover:bg-accent-heat text-slate-900 font-heading font-bold px-6 py-3 rounded-full transition-all"
                >
                  Continue Exploring
                </button>
              </div>
            )}

            {/* Active question */}
            {!isLoading && !isQuizComplete && currentQuiz && (
              <>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-frost/60 text-xs font-body">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-frost/60 text-xs font-body">
                      {correctAnswers} correct
                    </span>
                  </div>
                  <div className="h-1 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-warm transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Topic name */}
                <div className="text-frost/60 text-sm font-body mb-2">
                  Mastery Quiz: {parentTopic}
                </div>

                {/* Question */}
                <h2 className="text-frost text-lg font-heading font-bold mb-6">
                  {currentQuiz.question}
                </h2>

                {/* Answer options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQuiz.options.map((option, index) => {
                    const isCorrect = index === currentQuiz.correctIndex
                    const isSelected = index === selectedIndex
                    const isWrong = isSelected && !isCorrect
                    const showResult = quizResult !== null

                    let buttonClass =
                      'bg-slate-700/60 hover:bg-slate-600/80 text-frost font-body text-sm px-4 py-3 rounded-xl border border-slate-500/30 transition-all'

                    if (showResult) {
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
                        disabled={quizResult !== null}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}


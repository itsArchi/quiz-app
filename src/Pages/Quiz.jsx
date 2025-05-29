"use client"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useQuizStore from "../Store/quizStore"
import useQuizTimer from "../Hooks/useQuizTimer"
import { motion, AnimatePresence } from "framer-motion"
import { Info } from "lucide-react"

const Quiz = () => {
  const navigate = useNavigate()
  const hasNavigatedRef = useRef(false)

  const {
    questions,
    currentQuestionIndex,
    timeRemaining,
    isActive,
    isUsingFallback,
    answerQuestion,
    endQuiz,
    getCurrentQuestion,
    getProgress,
    getTimeProgress,
    isQuizComplete,
  } = useQuizStore()

  useQuizTimer()

  const currentQuestion = getCurrentQuestion()

  useEffect(() => {
    if (questions.length === 0 || !isActive) {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true
        setTimeout(() => {
          navigate("/setup", { replace: true })
        }, 0)
      }
    }
  }, [questions, isActive, navigate])

  useEffect(() => {
    if (isQuizComplete() && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      endQuiz()
      setTimeout(() => {
        navigate("/results", { replace: true })
      }, 100)
    }
  }, [isQuizComplete, endQuiz, navigate])

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading quiz...</div>
      </div>
    )
  }

  const handleAnswer = (answer) => {
    answerQuestion(answer)
  }

  const handleEndQuiz = () => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      endQuiz()
      setTimeout(() => {
        navigate("/results", { replace: true })
      }, 0)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const progress = getProgress()
  const timeProgress = getTimeProgress()

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl"
      >
        {/* Fallback notification */}
        {isUsingFallback && (
          <div className="p-4 bg-blue-900 bg-opacity-20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-400">
                Using backup questions - the quiz service was busy, but you can still enjoy the quiz!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-300">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className="text-sm text-gray-400">
                {currentQuestion.category} -{" "}
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{formatTime(timeRemaining)}</div>
              <p className="text-sm text-gray-400">Time Remaining</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${timeProgress}%` }}
                className="h-full bg-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-700 rounded-lg">
          <h3
            className="text-xl font-medium text-white"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {currentQuestion.all_answers?.map((answer, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(answer)}
                  className="w-full p-4 text-left text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleEndQuiz}
            className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            End Quiz
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Quiz

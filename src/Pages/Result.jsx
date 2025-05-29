import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, Award } from "lucide-react"
import useQuizStore from "../Store/quizStore"

const Results = () => {
  const navigate = useNavigate()
  const { questions, answers, resetQuiz } = useQuizStore()

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/setup")
    }
  }, [questions, navigate])

  // HITING HASIL
  const totalQuestions = questions.length
  const answeredQuestions = answers.filter((answer) => answer !== null).length
  const correctAnswers = questions.reduce((count, question, index) => {
    return count + (answers[index] === question.correct_answer ? 1 : 0)
  }, 0)
  const incorrectAnswers = answeredQuestions - correctAnswers
  const unansweredQuestions = totalQuestions - answeredQuestions

  // PERSENTASE SKOR
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  let resultMessage = ""
  if (scorePercentage >= 80) {
    resultMessage = "Excellent !!"
  } else if (scorePercentage >= 60) {
    resultMessage = "Good job !"
  } else if (scorePercentage >= 40) {
    resultMessage = "Not bad !"
  } else {
    resultMessage = "Nice Try !"
  }

  const handleResetQuiz = () => {
    resetQuiz()
    navigate("/setup")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
            Quiz Results
          </h1>
          <p className="mt-2 text-gray-400">{resultMessage}</p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-48 h-48"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="block text-5xl font-bold text-white">{scorePercentage}%</span>
                <span className="text-gray-400">Score</span>
              </div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="10" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * scorePercentage) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * scorePercentage) / 100 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </svg>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-lg font-medium text-white">Correct</h3>
                <p className="text-2xl font-bold text-emerald-400">{correctAnswers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-medium text-white">Incorrect</h3>
                <p className="text-2xl font-bold text-red-400">{incorrectAnswers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="text-lg font-medium text-white">Unanswered</h3>
                <p className="text-2xl font-bold text-yellow-400">{unansweredQuestions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-white">Total</h3>
                <p className="text-2xl font-bold text-blue-400">{totalQuestions}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Question Review</h2>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                className="p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {answers[index] === question.correct_answer ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : answers[index] === null ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white" dangerouslySetInnerHTML={{ __html: question.question }} />
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-400">
                        Correct answer:{" "}
                        <span
                          className="text-emerald-400"
                          dangerouslySetInnerHTML={{ __html: question.correct_answer }}
                        />
                      </p>
                      {answers[index] && answers[index] !== question.correct_answer && (
                        <p className="text-sm text-gray-400">
                          Your answer:{" "}
                          <span className="text-red-400" dangerouslySetInnerHTML={{ __html: answers[index] || "" }} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResetQuiz}
            className="px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
          >
            Start New Quiz
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Results

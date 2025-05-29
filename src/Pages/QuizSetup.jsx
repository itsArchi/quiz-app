import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../Store/authStore"
import useQuizStore from "../Store/quizStore"
import { AlertCircle, Info } from "lucide-react"

const QuizSetup = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { fetchQuestions, fetchCategories, startQuiz } = useQuizStore()

  const [amount, setAmount] = useState(5) // Start with 5 for testing
  const [category, setCategory] = useState("any")
  const [difficulty, setDifficulty] = useState("any")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([{ id: "any", name: "Any Category" }])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showRateLimitInfo, setShowRateLimitInfo] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true)
      try {
        const apiCategories = await fetchCategories()
        if (apiCategories.length > 0) {
          setCategories([
            { id: "any", name: "Any Category" },
            ...apiCategories.map((cat) => ({
              id: cat.id.toString(),
              name: cat.name,
            })),
          ])
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
        // Categories will remain as just "Any Category"
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [fetchCategories])

  const difficulties = [
    { id: "any", name: "Any Difficulty" },
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ]

  const handleStartQuiz = async () => {
    setIsLoading(true)
    setError("")
    setShowRateLimitInfo(false)

    try {
      console.log("Starting quiz setup...")
      await fetchQuestions(amount, category, difficulty)
      console.log("Questions fetched, starting quiz...")
      startQuiz()
      console.log("Quiz started, navigating to /quiz...")

      // Navigate to quiz page
      setTimeout(() => {
        navigate("/quiz", { replace: true })
      }, 100)
    } catch (error) {
      console.error("Error in handleStartQuiz:", error)
      // Check if it's a rate limit error
      if (error.message.includes("busy") || error.message.includes("rate")) {
        setShowRateLimitInfo(true)
      }
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError("")
    setShowRateLimitInfo(false)
    handleStartQuiz()
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl opacity-0 animate-fadeIn"
        style={{ animation: "fadeIn 0.5s forwards" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
              Quiz Setup
            </h1>
            <p className="text-gray-400">Welcome, {user?.username}</p>
          </div>
          <button onClick={logout} className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
            Logout
          </button>
        </div>

        {/* Rate limit info */}
        {showRateLimitInfo && (
          <div className="p-4 bg-blue-900 bg-opacity-20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-400">
                  The quiz service is busy right now. Don't worry - we'll use our backup questions so you can still
                  play!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
              Number of Questions
            </label>
            <select
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {[5, 10, 15, 20, 25, 30].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={categoriesLoading}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesLoading && <p className="mt-1 text-xs text-gray-400">Loading categories...</p>}
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {difficulties.map((diff) => (
                <option key={diff.id} value={diff.id}>
                  {diff.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-900 bg-opacity-20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-400">{error}</p>
                  <button onClick={handleRetry} className="mt-2 text-sm text-red-300 hover:text-red-200 underline">
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartQuiz}
            disabled={isLoading}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03] active:scale-[0.97]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading Questions...</span>
              </div>
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizSetup

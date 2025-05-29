import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "../api/index"
import { processQuestions } from "../api/quizUtils"

const initialQuizState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  totalTime: 0,
  isActive: false,
  category: "",
  difficulty: "",
  amount: 10,
}

const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API attempt ${attempt}/${maxRetries}`)
      return await apiCall()
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message)

      if (error.response?.status === 429) {
        const delay = baseDelay * Math.pow(2, attempt) 
        console.log(`Rate limited. Waiting ${delay / 1000}s before retry...`)

        if (attempt === maxRetries) {
          throw new Error("The quiz service is busy. Please wait a few minutes and try again.")
        }

        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        if (attempt === maxRetries) {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, baseDelay * attempt))
      }
    }
  }
}

const fallbackQuestions = [
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    all_answers: ["Paris", "London", "Berlin", "Madrid"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is 2 + 2?",
    correct_answer: "4",
    incorrect_answers: ["3", "5", "6"],
    all_answers: ["4", "3", "5", "6"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "Which planet is closest to the Sun?",
    correct_answer: "Mercury",
    incorrect_answers: ["Venus", "Earth", "Mars"],
    all_answers: ["Mercury", "Venus", "Earth", "Mars"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What color do you get when you mix red and blue?",
    correct_answer: "Purple",
    incorrect_answers: ["Green", "Orange", "Yellow"],
    all_answers: ["Purple", "Green", "Orange", "Yellow"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "How many days are there in a week?",
    correct_answer: "7",
    incorrect_answers: ["5", "6", "8"],
    all_answers: ["7", "5", "6", "8"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    all_answers: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "Which animal is known as the King of the Jungle?",
    correct_answer: "Lion",
    incorrect_answers: ["Tiger", "Elephant", "Gorilla"],
    all_answers: ["Lion", "Tiger", "Elephant", "Gorilla"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What do bees produce?",
    correct_answer: "Honey",
    incorrect_answers: ["Milk", "Silk", "Wax"],
    all_answers: ["Honey", "Milk", "Silk", "Wax"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "How many continents are there?",
    correct_answer: "7",
    incorrect_answers: ["5", "6", "8"],
    all_answers: ["7", "5", "6", "8"].sort(() => Math.random() - 0.5),
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the fastest land animal?",
    correct_answer: "Cheetah",
    incorrect_answers: ["Lion", "Horse", "Leopard"],
    all_answers: ["Cheetah", "Lion", "Horse", "Leopard"].sort(() => Math.random() - 0.5),
  },
]

const useQuizStore = create(
  persist(
    (set, get) => ({
      ...initialQuizState,
      isUsingFallback: false,

      fetchQuestions: async (amount, category, difficulty) => {
        console.log(`Starting fetchQuestions with amount: ${amount}, category: ${category}, difficulty: ${difficulty}`)

        try {
          console.log(`Fetching ${amount} questions...`)

          const apiCall = async () => {
            const queryParams = {
              amount: amount.toString(),
            }

            if (category && category !== "any") {
              queryParams.category = category
            }

            if (difficulty && difficulty !== "any") {
              queryParams.difficulty = difficulty
            }

            console.log("Query params:", queryParams)

            const response = await api.get("/api.php", {
              params: queryParams,
              timeout: 30000,
            })

            return response
          }

          const response = await retryApiCall(apiCall, 3, 3000) 

          console.log("API Response:", response.data)

          if (response.data.response_code === 0) {
            const processedQuestions = processQuestions(response.data.results)

            console.log(`Successfully processed ${processedQuestions.length} questions`)

            set({
              questions: processedQuestions,
              answers: Array(processedQuestions.length).fill(null),
              currentQuestionIndex: 0,
              timeRemaining: amount * 10,
              totalTime: amount * 10,
              category,
              difficulty,
              amount,
              isUsingFallback: false,
              isActive: false, 
            })

            console.log("Questions stored in state successfully")
            return 
          } else {
            const errorMessages = {
              1: "No results found. Using fallback questions instead.",
              2: "Invalid parameter. Using fallback questions instead.",
              3: "Token not found. Using fallback questions instead.",
              4: "Token empty. Using fallback questions instead.",
            }

            const errorMessage =
              errorMessages[response.data.response_code] || `API Error: Response code ${response.data.response_code}`

            console.warn(errorMessage)
            throw new Error(errorMessage)
          }
        } catch (error) {
          console.error("Error fetching questions:", error)

          console.log("Using fallback questions...")

          const shuffledFallback = [...fallbackQuestions].sort(() => Math.random() - 0.5)
          const selectedQuestions = shuffledFallback.slice(0, Math.min(amount, fallbackQuestions.length))

          set({
            questions: selectedQuestions,
            answers: Array(selectedQuestions.length).fill(null),
            currentQuestionIndex: 0,
            timeRemaining: selectedQuestions.length * 10,
            totalTime: selectedQuestions.length * 10,
            category: "General Knowledge",
            difficulty: "easy",
            amount: selectedQuestions.length,
            isUsingFallback: true,
            isActive: false,
          })

          console.log(`Using ${selectedQuestions.length} fallback questions`)
      
          return
        }
      },

      fetchCategories: async () => {
        try {
          console.log("Fetching categories...")

          const apiCall = async () => {
            return await api.get("/api_category.php", {
              timeout: 15000,
            })
          }

          const response = await retryApiCall(apiCall, 2, 2000)

          console.log("Categories fetched successfully")
          return response.data.trivia_categories
        } catch (error) {
          console.error("Error fetching categories:", error)

          return [
            { id: 9, name: "General Knowledge" },
            { id: 17, name: "Science & Nature" },
            { id: 21, name: "Sports" },
            { id: 23, name: "History" },
          ]
        }
      },

      startQuiz: () => {
        console.log("Starting quiz - setting isActive to true")
        set({ isActive: true })

        const state = get()
        console.log("Quiz state after startQuiz:", {
          questionsCount: state.questions.length,
          isActive: state.isActive,
          currentQuestionIndex: state.currentQuestionIndex,
          timeRemaining: state.timeRemaining,
        })
      },

      answerQuestion: (answer) => {
        const { answers, currentQuestionIndex } = get()
        const newAnswers = [...answers]
        newAnswers[currentQuestionIndex] = answer

        set({
          answers: newAnswers,
          currentQuestionIndex: currentQuestionIndex + 1,
        })
      },

      endQuiz: () => {
        set({ isActive: false })
      },

      resetQuiz: () => {
        set({ ...initialQuizState, isUsingFallback: false })
      },

      clearQuiz: () => {
        set({ ...initialQuizState, isUsingFallback: false })
      },

      decrementTime: () => {
        const { timeRemaining } = get()
        if (timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },

      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get()
        return questions[currentQuestionIndex]
      },

      getProgress: () => {
        const { currentQuestionIndex, questions } = get()
        return questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0
      },

      getTimeProgress: () => {
        const { timeRemaining, totalTime } = get()
        return totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0
      },

      isQuizComplete: () => {
        const { currentQuestionIndex, questions } = get()
        return currentQuestionIndex >= questions.length && questions.length > 0
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        totalTime: state.totalTime,
        isActive: state.isActive,
        category: state.category,
        difficulty: state.difficulty,
        amount: state.amount,
        isUsingFallback: state.isUsingFallback,
      }),
    },
  ),
)

export default useQuizStore

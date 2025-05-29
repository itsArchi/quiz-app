import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useQuizStore from "../Store/quizStore"

const useQuizTimer = () => {
  const navigate = useNavigate()
  const hasNavigatedRef = useRef(false)
  const { isActive, timeRemaining, decrementTime, endQuiz } = useQuizStore()

  useEffect(() => {
    let interval

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        decrementTime()
      }, 1000)
    } else if (timeRemaining === 0 && isActive && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      endQuiz()
      setTimeout(() => {
        navigate("/results")
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining, decrementTime, endQuiz, navigate])

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      hasNavigatedRef.current = false
    }
  }, [isActive, timeRemaining])
}

export default useQuizTimer

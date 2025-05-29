export const initialQuizState = {
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
  
  export const decodeHTML = (html) => {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
  }
  
  export const processQuestions = (questions) => {
    return questions.map((q) => {
      const decodedQuestion = decodeHTML(q.question)
      const decodedCorrectAnswer = decodeHTML(q.correct_answer)
      const decodedIncorrectAnswers = q.incorrect_answers.map(decodeHTML)
  
      const allAnswers = [...decodedIncorrectAnswers, decodedCorrectAnswer].sort(() => Math.random() - 0.5)
  
      return {
        ...q,
        question: decodedQuestion,
        correct_answer: decodedCorrectAnswer,
        incorrect_answers: decodedIncorrectAnswers,
        all_answers: allAnswers,
      }
    })
  }
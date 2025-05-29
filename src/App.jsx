import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "../src/Pages/Login"
import QuizSetup from "../src/Pages/QuizSetup"
import Quiz from "../src/Pages/Quiz"
import NotFound from "../src/Pages/NotFound"
import Register from "./pages/register"
import ProtectedRoute from "./Components/protectedRoute"
import Results from "./Pages/Result"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <QuizSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

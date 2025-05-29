import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../Store/authStore"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const hasNavigatedRef = useRef(false)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  // Handle navigation when authenticated - only once
  useEffect(() => {
    if (isAuthenticated && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        navigate("/setup", { replace: true })
      }, 0)
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (error) {
      setError("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.username.trim() || !formData.password) {
      setError("Username and password are required")
      return
    }

    try {
      const success = login(formData.username, formData.password)
      if (!success) {
        setError("Invalid username or password")
      }
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      setError(error.message)
    }
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
            QuizMaster
          </h1>
          <p className="mt-2 text-gray-400">Test your knowledge with our interactive quizzes</p>
        </div>

        {error && <div className="p-3 text-sm text-red-400 bg-red-900 bg-opacity-20 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              className="w-full px-4 py-3 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
            >
              Log In
            </motion.button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-400 hover:text-teal-300">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

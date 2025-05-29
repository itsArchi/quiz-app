import { Link } from "react-router-dom"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 text-center space-y-8 bg-gray-800 rounded-xl shadow-2xl"
      >
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
        <div>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
            >
              Go Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

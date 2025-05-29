import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import path from "path"

// Get the directory name equivalent to __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  server: {
    port: 3000, // Try a different port
    strictPort: false,
    open: true, // Automatically open browser
    force: true, // Force dependency pre-bundling
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    force: true, // Force dependency optimization
  },
  clearScreen: false, // Don't clear console output
})

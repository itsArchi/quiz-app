import axios from "axios"

const api = axios.create({
  baseURL: "https://opentdb.com",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log(`API response received from: ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("Response error:", error)

    if (error.code === "ECONNABORTED") {
      console.error("Request timed out")
    } else if (error.response) {
      console.error("Server responded with error:", error.response.status)
    } else if (error.request) {
      console.error("No response received")
    }

    return Promise.reject(error)
  },
)

export default api

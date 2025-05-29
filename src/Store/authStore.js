import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      register: (username, password) => {
        const { users } = get()

        if (users.some((user) => user.username === username)) {
          throw new Error("Username already exists")
        }

        const updatedUsers = [...users, { username, password }]

        set({ users: updatedUsers })
        return true
      },

      login: (username, password) => {
        const { users } = get()

        const foundUser = users.find((user) => user.username === username && user.password === password)

        if (foundUser) {
          const userInfo = { username: foundUser.username }
          set({
            user: userInfo,
            isAuthenticated: true,
          })
          return true
        }

        return false
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }),
    },
  ),
)

export default useAuthStore

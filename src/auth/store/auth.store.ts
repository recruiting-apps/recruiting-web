import { type UserLogin, type UserToStorage } from '@/users/models/user.interface'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthServices } from '../services/auth.service'

interface AuthState {
  isAuthenticated: boolean
  user: UserToStorage | null

  login: (credentials: UserLogin) => Promise<UserToStorage | null>
  logout: () => void
}

type DefaultAuthState = Pick<AuthState, 'isAuthenticated' | 'user'>

export const useAuthStore = create(
  persist<AuthState>((set, _) => {
    const DEFAULT_STATE: DefaultAuthState = {
      isAuthenticated: false,
      user: null
    }

    return {
      ...DEFAULT_STATE,

      login: async (credentials) => {
        const authService = new AuthServices()

        return await authService.login(credentials)
          .then(user => {
            set({
              isAuthenticated: user !== null,
              user
            })

            return user
          })
      },
      logout: () => {
        set({ ...DEFAULT_STATE })
      }
    }
  },
  {
    name: 'auth-storage'
  }
  )
)

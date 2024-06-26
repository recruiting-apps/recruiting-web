import { type UserLogin, type UserToStorage } from '@/users/models/user.interface'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AuthServices, type RegisterAsGoogle } from '../services/auth.service'
import appStorage from '@/shared/config/storage'

export const AUTH_STORAGE_KEY = 'userInfo'

interface AuthState {
  isAuthenticated: boolean
  user: UserToStorage | null
  token: string | null

  login: (credentials: UserLogin) => Promise<UserToStorage | null>
  logout: () => void
  loginWithGoogle: (googleDto: RegisterAsGoogle) => Promise<UserToStorage | null>
  toggleEmailNotification: () => void
}

type DefaultAuthState = Pick<AuthState, 'isAuthenticated' | 'user' | 'token'>

export const useAuthStore = create(
  persist<AuthState>((set, _) => {
    const DEFAULT_STATE: DefaultAuthState = {
      isAuthenticated: false,
      user: null,
      token: null
    }

    return {
      ...DEFAULT_STATE,

      login: async (credentials) => {
        const authService = new AuthServices()

        return await authService.login(credentials)
          .then(response => {
            const { user, token } = response

            set({
              isAuthenticated: user !== null,
              user,
              token
            })

            return user
          })
      },
      loginWithGoogle: async (googleDto) => {
        const authService = new AuthServices()

        return await authService.registerAsGoogle(googleDto)
          .then(response => {
            const { user, token } = response

            set({
              isAuthenticated: user !== null,
              user,
              token
            })

            return user
          })
      },
      logout: () => {
        set({ ...DEFAULT_STATE })
      },
      toggleEmailNotification: () => {
        set(state => {
          if (state.user) {
            const user = { ...state.user, emailNotification: !state.user.emailNotification }

            return { ...state, user }
          }

          return state
        })
      }
    }
  },
  {
    name: AUTH_STORAGE_KEY,
    storage: createJSONStorage(() => appStorage)
  }
  )
)

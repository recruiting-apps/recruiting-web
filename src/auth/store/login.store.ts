import appStorage from '@/shared/config/storage'
import { type UserDto } from '@/users/models/user.interface'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LoginUser {
  user: UserDto | null
  updateUser: (user: UserDto) => void
}

export const useLoginUser = create(
  persist<LoginUser>(
    (set, get) => ({
      user: null,
      updateUser: (user) => {
        const currentUser = get().user

        set({
          user: {
            ...currentUser,
            ...user
          }
        })
      }
    }),
    {
      name: 'loginUser',
      storage: createJSONStorage(() => appStorage)
    }
  )
)

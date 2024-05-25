import { AppServices } from '@/shared/services/api.service'
import { StatusCodes } from 'http-status-codes'

import { type UserDto, type User, type UserLogin, type UserToStorage } from '@/users/models/user.interface'
import { type LoginResponse } from '../response/login.response'
import appStorage from '@/shared/config/storage'
import cookiesStorage from '@/shared/config/storage/cookies'
import { AUTH_STORAGE_KEY } from '../store/auth.store'

export interface RegisterAsGoogle {
  email: string
  user?: UserDto
}

export class AuthServices extends AppServices {
  constructor () {
    super({ baseUrl: 'auth', contentType: 'application/json' })
  }

  login = async (userLogin: UserLogin): Promise<{ user: UserToStorage | null, token: string | null }> => {
    return await this.post<LoginResponse>('/login', userLogin)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, fullName, role, emailNotification } = authenticatedUser

          const userStorage: UserToStorage = {
            id,
            fullName,
            role,
            emailNotification
          }

          cookiesStorage.setSessionExpiration()

          return {
            user: userStorage,
            token: tokens.accessToken
          }
        }

        return {
          user: null,
          token: null
        }
      })
  }

  logout = (): void => {
    appStorage.removeItem(AUTH_STORAGE_KEY)
    cookiesStorage.clearSessionExpiration()
  }

  register = async (user: UserDto): Promise<User> => {
    return await this.post<User>('/register', user)
      .then(response => response.data)
  }

  registerAsGoogle = async (googleDto: RegisterAsGoogle): Promise<{ user: UserToStorage | null, token: string | null }> => {
    return await this.post<LoginResponse>('/google', googleDto)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, fullName, role, emailNotification } = authenticatedUser

          const userStorage: UserToStorage = {
            id,
            fullName,
            role,
            emailNotification
          }

          cookiesStorage.setSessionExpiration()

          return {
            user: userStorage,
            token: tokens.accessToken
          }
        }

        return {
          user: null,
          token: null
        }
      })
  }

  changePassword = async (id: string, dto: { password: string }): Promise<User> => {
    return await this.patch<User>(`/${id}/change-password`, dto)
      .then(response => response.data)
  }

  resetPassword = async (payload: { token: string, password: string }): Promise<void> => {
    await this.post('/reset-password', payload)
      .then(response => response.data)
  }

  forgotPassword = async (email: string): Promise<void> => {
    await this.post('/forgot-password', { email })
      .then(response => response.data)
  }
}

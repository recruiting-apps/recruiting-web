import { AppServices } from '@/shared/services/api.service'
import { StatusCodes } from 'http-status-codes'

import { type User, type UserLogin, type UserToStorage } from '@/users/models/user.interface'
import { type LoginResponse } from '../response/login.response'
import { AuthStore } from './auth.store'

export class AuthServices extends AppServices {
  storeService: AuthStore

  constructor () {
    super({ baseUrl: 'auth', contentType: 'application/json' })
    this.storeService = new AuthStore()
  }

  login = async (userLogin: UserLogin): Promise<UserToStorage | null> => {
    return await this.post<LoginResponse>('/login', userLogin)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, fullName, role } = authenticatedUser

          const userStorage: UserToStorage = {
            id,
            fullName,
            role
          }

          this.storeService.saveToken(tokens.accessToken)

          return userStorage
        }

        return null
      })
  }

  logout = (): void => {
    localStorage.removeItem('auth-storage')
    this.storeService.removeToken()
  }

  changePassword = async (id: string, dto: { password: string }): Promise<User> => {
    return await this.patch<User>(`/${id}/change-password`, dto)
      .then(response => response.data)
  }
}

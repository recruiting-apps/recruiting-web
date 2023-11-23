import { type User } from '@/users/models/user.interface'

export interface LoginResponse {
  tokens: {
    accessToken: string
  }
  authenticatedUser: User
}

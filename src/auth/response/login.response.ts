import { type User } from '@/users/models/user.interface'

export interface LoginResponse {
  tokens: {
    accessToken: string
  }
  authenticatedUser: User
}

export interface GoogleLoginResponse extends Pick<LoginResponse, 'tokens'> {
  authenticatedUser: User | null
}

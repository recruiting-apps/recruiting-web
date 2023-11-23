import { type Role } from './enum/role.enum'

export interface User {
  id: string
  role: Role

  name: string
  lastName: string
  fullName: string
  profession: string
  description: string

  email: string
  bornDate: Date
  phone: string
  address: string

  education: string
  workExperience: string
  abilities: string[]

  cvPath: string
  profileImagePath: string

  googleAccount: boolean
}

export interface UserDto extends Omit<User, 'id' | 'fullName'> {
  password: string
}

export interface UserLogin extends Pick<User, 'email'> {
  password: string
}

export interface UserToStorage extends Pick<User, 'id' | 'fullName' | 'role'> {}

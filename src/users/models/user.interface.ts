import { type AdditionalFile } from './additional-file.interface'
import { type Role } from './enum/role.enum'

export interface PresentationLetter {
  name: string
  content: string
}

export interface User {
  id: number
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
  emailNotification: boolean

  presentationLetters: PresentationLetter[]
  files: AdditionalFile[]
}

export interface UserDto extends Omit<User, 'id' | 'fullName' | 'files'> {
  password: string
}

export interface UserLogin extends Pick<User, 'email'> {
  password: string
}

export interface UserToStorage extends Pick<User, 'id' | 'fullName' | 'role' | 'emailNotification'> {}

export const userToDto = (user: User): UserDto => ({
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  password: '',
  role: user.role,
  phone: user.phone,
  profession: user.profession,
  address: user.address,
  description: user.description,
  education: user.education,
  workExperience: user.workExperience,
  abilities: user.abilities,
  bornDate: user.bornDate,
  cvPath: user.cvPath,
  profileImagePath: user.profileImagePath,
  googleAccount: user.googleAccount,
  emailNotification: user.emailNotification,
  presentationLetters: user.presentationLetters
})

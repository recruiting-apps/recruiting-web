import { type User } from '@/users/models/user.interface'
import { type Status } from './enums/status.enum'

export interface Application {
  id: number
  applicationDate: string
  status: Status
  comments: string
  letter: string | null
  user: User
  order: number
}

export interface ApplicationDto {
  status?: Status
  comments?: string
  letter?: string
}

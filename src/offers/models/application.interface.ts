import { type User } from '@/users/models/user.interface'
import { type Status } from './enums/status.enum'

export interface Application {
  id: string
  applicationDate: string
  status: Status
  comments: string
  letter: string | null
  user: User
}

export interface ApplicationDto {
  status?: Status
  comments?: string
  letter?: string
}

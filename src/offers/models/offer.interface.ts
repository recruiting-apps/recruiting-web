import { type User } from '@/users/models/user.interface'
import { type Application } from './application.interface'

export interface Offer {
  id: number

  title: string
  description: string
  company: string
  location: string
  salary: string | number

  sorted: boolean
  closed: boolean
  publicationDate: string
  expirationDate: string

  expectedAbilities: string[]

  user: User
  applications: Application[]
}

export interface OfferDto extends Omit<Offer, 'id' | 'user' | 'applications' | 'sorted'> {}

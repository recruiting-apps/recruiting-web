import { type ReactElement } from 'react'
import { type DropdownLink } from './ui/components/header/Dropdown'

export type FormAction = 'add' | 'update'

export interface NavbarLink {
  name: string
  isDropdown: boolean
  isLogout?: boolean
  icon?: ReactElement
  to: string
  subLinks?: DropdownLink[]
}

export interface DataContextInterface<T> {
  data: T[]

  add: (data: T) => void
  update: (data: T) => void
  remove: (id: string) => void
}

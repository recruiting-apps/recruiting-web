import { type NavbarLink } from '@/shared/types'
import { Role } from '@/users/models/enum/role.enum'

export const ROLE_LINKS: Record<Role, NavbarLink[]> = {
  [Role.ADMIN]: [
    { name: 'Offers', to: '/offers', isDropdown: false },
    { name: 'Profile', to: '/profile', isDropdown: false }
  ],
  [Role.APPLICANT]: [
    { name: 'Offers', to: '/offers', isDropdown: false },
    { name: 'My applications', to: '/my-applications', isDropdown: false },
    { name: 'Profile', to: '/profile', isDropdown: false }
  ],
  [Role.RECRUITER]: [
    { name: 'Offers', to: '/offers', isDropdown: false },
    { name: 'My Offers', to: '/my-offers', isDropdown: false },
    { name: 'Profile', to: '/profile', isDropdown: false }
  ]
}

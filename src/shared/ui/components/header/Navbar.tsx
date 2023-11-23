import { useAuthStore } from '@/auth/store/auth.store'
import { ArrowDown } from '../../assets/icons/AppIcons'
import { type NavbarLink } from '@/shared/types'
import { ROLE_LINKS } from './RoleLinks'
import { Role } from '@/users/models/enum/role.enum'
import LinkDropdown from './LinkDropdown'
import { NavLink } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

const DEFAULT_LINKS: NavbarLink[] = [
  // { name: 'Inicio', to: '/home', isDropdown: false }
]

export const MenuIcon: React.FC<{ name: string }> = ({ name }) => {
  return (
    <a className='text-gray-300 hover:text-white flex items-center gap-1'>
      {name}
      <ArrowDown className='w-5 h-5 mt-[2px]' />
    </a>
  )
}

interface NavBarProps {
  extraLinkClasses?: string
}

const NavBar: React.FC<NavBarProps> = ({ extraLinkClasses = '' }) => {
  const currentUser = useAuthStore(state => state.user)

  const links: NavbarLink[] = [
    ...DEFAULT_LINKS,
    ...ROLE_LINKS[currentUser?.role ?? Role.APPLICANT]
  ]

  return (
    <>
      {
        links.map(({ name, to, subLinks = [], isDropdown, icon }) => {
          const subLinksWithFullRoute = subLinks.map(subLink => {
            return {
              ...subLink,
              to: `${to}/${subLink.to}`
            }
          })

          return isDropdown
            ? (
              <LinkDropdown
                key={name}
                subLinks={subLinksWithFullRoute}
                menu={icon ?? <MenuIcon name={name} />}
              />
              )
            : (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `font-m px-4 sm:px-1 md:px-2 py-1 md:py-0 transition-all hover:text-white hover:font-semibold text-center grid place-items-center
              ${extraLinkClasses} ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`
                }
              >
                {name}
              </NavLink>
              )
        })
      }

      <ProfileDropdown />
    </>
  )
}

export default NavBar

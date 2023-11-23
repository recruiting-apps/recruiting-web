import { Menu } from '@headlessui/react'
import DropDown, { type DropdownLink } from './Dropdown'
import { NavLink } from 'react-router-dom'

interface LinkDropdownProps {
  menu: React.ReactNode
  subLinks: DropdownLink[]
}

const LinkDropdown: React.FC<LinkDropdownProps> = ({ menu, subLinks }) => {
  return (
    <DropDown menu={menu}>
      {
        subLinks.map((subLink, index) => {
          return (
            <div key={index} className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to={subLink.to}
                    className={({ isActive }) =>
                      `group flex gap-3 w-full items-center rounded-md px-2 py-2 text-sm
                        ${isActive || active ? 'bg-blue-era text-white' : ''}`
                    }
                  >
                    {subLink.icon}
                    {subLink.name}
                  </NavLink>
                )}
              </Menu.Item>
            </div>
          )
        })
      }
    </DropDown>
  )
}

export default LinkDropdown

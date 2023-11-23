import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export interface DropdownLink {
  name: string
  to: string
  icon?: React.ReactNode
}

interface DropDownProps {
  menu: React.ReactNode
  children?: React.ReactNode
}

const DropDown: React.FC<DropDownProps> = ({ menu, children }) => {
  return (
    <div className='grid place-items-center ml-1'>
      <Menu as="div" className="relative inline-block text-left">
        <div className='grid place-items-center'>
          <Menu.Button className='font-m px-2 transition-all hover:text-white hover:font-semibold'>
            {menu}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-5 w-48 z-50 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-card  ring-1 ring-black ring-opacity-5 focus:outline-none">
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default DropDown

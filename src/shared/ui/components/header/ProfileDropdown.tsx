import { Menu } from '@headlessui/react'
import { LogoutIcon, UserCircleIcon } from '../../assets/icons/AppIcons'
import { useAuthStore } from '@/auth/store/auth.store'
import { useAuth } from '@/auth/hooks/useAuth'
import DropDown from './Dropdown'

const ProfileDropDown: React.FC = () => {
  const currentUser = useAuthStore(state => state.user)
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <DropDown menu={<UserCircleIcon className='w-8 h-8 text-white' />}>
      <div className="px-1 py-1 ">
        <Menu.Item>
          {() => (
            <button
              className='group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-default font-semibold'
            >
              <UserCircleIcon className='w-5 h-5 mr-2' />
              {currentUser?.fullName}
            </button>
          )}
        </Menu.Item>
      </div>
      <div className="px-1 py-1 ">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${active ? 'bg-blue-era text-white' : ''
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              onClick={handleLogout}
            >
              <LogoutIcon className='w-5 h-5 mr-2' />
              Cerrar Sesión
            </button>
          )}
        </Menu.Item>
      </div>
    </DropDown>
  )
}

export default ProfileDropDown

import { useState } from 'react'
import { Link } from 'react-router-dom'

import useMediaQuery from '@/shared/hooks/userMediaQuery'
import { BarsIcon } from '../../assets/icons/AppIcons'
import NavBar from './Navbar'

const HamburgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  return (
    <button
      onClick={toggleMenu}
    >
      <span className='block border-[1px] border-gray-300 rounded-[4px] opacity-30 py-[1px] px-2 text-white transition-all hover:opacity-80'>
        <BarsIcon className='w-9 h-9' />
      </span>
    </button>
  )
}

const Header: React.FC = () => {
  const [isMenuToggled, setIsMenuToggled] = useState(false)

  const isAboveSmallScreens = useMediaQuery('(min-width: 770px)')

  return (
    <header className='relative bg-blue-era shadow-md shadow-black/10 py-2 md:py-4'>
      <nav className='flex mx-auto px-4 md:px-0 md:w-[85%] justify-between items-center md:justify-normal'>
        <div className='md:w-1/3'>
          <Link className="text-white text-xl" to="/home">
            <p className=''>Recruiting APP</p>
          </Link>
        </div>
        <div className='sm:flex md:justify-end md:items-center md:w-2/3'>
          {
            isAboveSmallScreens
              ? <NavBar />
              : <HamburgerMenu toggleMenu={() => { setIsMenuToggled(!isMenuToggled) }} />
          }
        </div>

        {/* {!isAboveSmallScreens && mobileNav()} */}
      </nav>
    </header>
  )
}

export default Header

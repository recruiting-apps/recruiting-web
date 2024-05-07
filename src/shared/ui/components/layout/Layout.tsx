import { Outlet } from 'react-router-dom'
import Header from '../header/Header'
import Toast from './Toast'
import SessionEndAlert from '../info/SessionEndAlert'

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <div className='max-w-[90%] mx-auto mt-4'>
        <Outlet />
      </div>

      <SessionEndAlert />
      <Toast />
    </>
  )
}

export default Layout

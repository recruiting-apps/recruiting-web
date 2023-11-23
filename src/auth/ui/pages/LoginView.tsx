import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import LoginForm from '@/auth/ui/components/LoginForm'
import { useAuthStore } from '@/auth/store/auth.store'
import Toast from '@/shared/ui/components/layout/Toast'

const LoginView: React.FC = () => {
  const navigate = useNavigate()
  const authenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (authenticated) navigate('/')
  }, [authenticated])

  return (
    <div className='h-screen grid place-items-center'>
      <div className='w-[380px] px-6 py-7 shadow-card-bold rounded-lg'>
        <div className='flex gap-4 items-center justify-center mb-4 pb-3 border-b-[1px] border-b-gray-300'>
          <h1 className='text-title text-2xl'>Recruiting APP</h1>
        </div>
        <LoginForm />
      </div>
      <Toast />
    </div>
  )
}

export default LoginView

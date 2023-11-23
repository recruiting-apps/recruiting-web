import { Navigate, useLocation } from 'react-router-dom'
import Layout from './Layout'
import { useAuth } from '@/auth/hooks/useAuth'

const AuthRequired: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return (
    isAuthenticated
      ? <Layout />
      : <Navigate to='/login' state={{ from: location }} replace/>
  )
}

export default AuthRequired

import { useAuth } from '@/auth/hooks/useAuth'
import { Role } from '@/users/models/enum/role.enum'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RoleRequired: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  return (
    user?.role === Role.ADMIN || user?.role === Role.RECRUITER
      ? <Outlet />
      : <Navigate to='/offers' state={{ from: location }} replace/>
  )
}

export default RoleRequired

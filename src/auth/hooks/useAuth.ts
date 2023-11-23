import { type UserLogin } from '@/users/models/user.interface'
import { useAuthStore } from '../store/auth.store'
import { Role } from '@/users/models/enum/role.enum'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    login,
    logout
  } = useAuthStore(state => state)

  const handleLogout = () => {
    logout()
  }

  const handleLogin = async (userLogin: UserLogin) => {
    return await login(userLogin)
      .then(user => user)
  }

  const hasPrivileges = user?.role === Role.ADMIN

  return {
    user,
    isAuthenticated,
    hasPrivileges,
    logout: handleLogout,
    login: handleLogin
  }
}

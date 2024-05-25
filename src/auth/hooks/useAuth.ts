import { type UserLogin } from '@/users/models/user.interface'
import { useAuthStore } from '../store/auth.store'
import { Role } from '@/users/models/enum/role.enum'
import { type RegisterAsGoogle } from '../services/auth.service'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    loginWithGoogle,
    toggleEmailNotification
  } = useAuthStore(state => state)

  const handleLogout = () => {
    logout()
  }

  const handleLogin = async (userLogin: UserLogin) => {
    return await login(userLogin)
      .then(user => user)
  }

  const handleLoginWithGoogle = async (googleDto: RegisterAsGoogle) => {
    return await loginWithGoogle(googleDto)
      .then(user => user)
  }

  const hasPrivileges = user?.role === Role.ADMIN

  return {
    user,
    isAuthenticated,
    hasPrivileges,
    logout: handleLogout,
    login: handleLogin,
    loginWithGoogle: handleLoginWithGoogle,
    toggleEmailNotification
  }
}

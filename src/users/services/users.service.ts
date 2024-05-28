import { AppServices } from '@/shared/services/api.service'
import { type UserDto, type User } from '../models/user.interface'

export class UsersService extends AppServices {
  constructor () {
    super({ baseUrl: 'users', contentType: 'application/json' })
  }

  findAll = async (): Promise<User[]> => {
    return await this.get<User[]>('')
      .then(response => response.data)
  }

  findByEmail = async (email: string): Promise<User | null> => {
    return await this.get<User | null>('/email', {
      params: { email }
    })
      .then(response => response.data)
  }

  findById = async (id: number): Promise<User> => {
    return await this.get<User>(`/${id}`)
      .then(response => response.data)
  }

  create = async (userDto: UserDto): Promise<User> => {
    return await this.post<User>('', userDto)
      .then(response => response.data)
  }

  toggleNotifications = async (id: number, emailNotification: boolean): Promise<User> => {
    return await this.patch<User>(`/${id}`, { emailNotification: !emailNotification })
      .then(response => response.data)
  }

  update = async (userDto: UserDto, id: number): Promise<User> => {
    const { password, ...user } = userDto
    return await this.patch<User>(`/${id}`, user)
      .then(response => response.data)
  }
}

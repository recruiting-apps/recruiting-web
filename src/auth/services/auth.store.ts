import StoreService from '@/shared/services/store.service'

interface AppStorage {
  token: string
}

const APP_STORAGE: AppStorage = {
  token: 'token'
}

export class AuthStore {
  store: StoreService<AppStorage>
  constructor () {
    this.store = new StoreService<AppStorage>({ initialState: APP_STORAGE })
  }

  getToken = (): string | null => {
    return this.store.get('token')
  }

  saveToken = (_token: string): void => {
    this.store.set('token', _token)
  }

  removeToken = (): void => {
    this.store.remove('token')
  }
}

import moment from 'moment'

const EXPIRATION_TIME = import.meta.env.VITE_AUTH_EXPIRATION_TIME ?? 36000
const EXPIRATION_LABEL = 'auth'

class CookiesStorage {
  setSessionExpiration (): void {
    const now = moment()

    const expiration = now.add(+EXPIRATION_TIME, 'seconds').format('YYYY-MM-DDTHH:mm:ss')

    document.cookie = `${EXPIRATION_LABEL}=${expiration}; path=/`
  }

  isSessionExpired (): boolean {
    const expiration = document.cookie
      .split('; ')
      .find(row => row.startsWith(EXPIRATION_LABEL))
      ?.split('=')[1]

    if (expiration === undefined) return true

    const now = moment()
    const expirationDate = moment(expiration)

    return now.isAfter(expirationDate)
  }

  clearSessionExpiration (): void {
    document.cookie = 'auth=; path=/'
  }
}

const cookiesStorage = new CookiesStorage()

export default cookiesStorage

import secureLocalStorage from 'react-secure-storage'

export class AppStorage {
  setItem (key: string, value: string): void {
    secureLocalStorage.setItem(key, value)
  }

  getItem (key: string): string | null {
    const value = secureLocalStorage.getItem(key)

    if (value === null) return null

    return String(value)
  }

  removeItem (key: string): void {
    secureLocalStorage.removeItem(key)
  }

  clear (): void {
    secureLocalStorage.clear()
  }
}

const appStorage = new AppStorage()

export default appStorage

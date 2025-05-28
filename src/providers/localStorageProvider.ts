import type { IStorageProvider } from '../types/interfaces/storageProvider'

export class LocalStorageProvider implements IStorageProvider {
  save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  delete(key: string): void {
    localStorage.removeItem(key)
  }
}

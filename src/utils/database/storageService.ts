import { LocalStorageProvider } from '../../providers/localStorageProvider'
import { IndexedDBProvider } from '../../providers/indexedDBProvider'

export class StorageService {
  private static localStorageProvider = new LocalStorageProvider()
  private static indexedDBProvider = new IndexedDBProvider()

  static async saveToLocalStorage<T>(key: string, data: T): Promise<void> {
    this.localStorageProvider.save(key, data)
  }

  static async getFromLocalStorage<T>(key: string): Promise<T | null> {
    return this.localStorageProvider.get(key)
  }

  static async deleteFromLocalStorage(key: string): Promise<void> {
    this.localStorageProvider.delete(key)
  }

  static async saveToIndexedDB<T>(key: string, data: T): Promise<void> {
    await this.indexedDBProvider.save(key, data)
  }

  static async getFromIndexedDB<T>(key: string): Promise<T | null> {
    return await this.indexedDBProvider.get(key)
  }

  static async deleteFromIndexedDB(key: string): Promise<void> {
    await this.indexedDBProvider.delete(key)
  }
}

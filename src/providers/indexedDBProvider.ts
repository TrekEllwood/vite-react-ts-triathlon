import type { IStorageProvider } from '../types/interfaces/storageProvider'
import { openDB, type IDBPDatabase } from 'idb'

export class IndexedDBProvider implements IStorageProvider {
  private db: IDBPDatabase | null = null

  // CHANGED: to appease eraseableSyntaxOnly rules
  private dbName: string
  private storeName: string

  constructor(dbName = 'TriathlonDB', storeName = 'TriathlonStore') {
    this.dbName = dbName
    this.storeName = storeName
  }

  // async init(): Promise<IDBPDatabase> {
  //   this.db = await openDB(this.dbName, 1, {
  //     upgrade(db) {
  //       if (!db.objectStoreNames.contains('TriathlonStore')) {
  //         db.createObjectStore('TriathlonStore')
  //       }
  //     }
  //   })
  //   return this.db
  // }

  // CHANGE: to handle opening and accessing the db better
  // private async openDB(): Promise<IDBPDatabase> {
  //   if (!this.db) {
  //     this.db = await openDB(this.dbName, 1, {
  //       upgrade(db) {
  //         if (!db.objectStoreNames.contains('TriathlonStore')) {
  //           db.createObjectStore('TriathlonStore')
  //         }
  //       }
  //     })
  //   }
  //   return this.db
  // }

  async save<T>(key: string, data: T): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    await tx.objectStore(this.storeName).put(data, key)
    await tx.done
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readonly')
    return await tx.objectStore(this.storeName).get(key) || null
  }

  async delete(key: string): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    await tx.objectStore(this.storeName).delete(key)
    await tx.done
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  async deleteDatabase(): Promise<void> {
    await this.close()
    await indexedDB.deleteDatabase(this.dbName)
  }

  // private async openDB(): Promise<IDBPDatabase> {
  //   if (this.db) return this.db
  //   return openDB(this.dbName, 1)
  // }

  // CHANGE: to handle opening and updating the db better
  private async openDB(): Promise<IDBPDatabase> {
    if (this.db) return this.db

    try {
      this.db = await this.openAndUpgradeDB()
      return this.db
    } catch (error) {
      if ((error as DOMException).name === 'InvalidStateError') {
        console.warn('[IndexedDBProvider] DB invalid — resetting...')
        await this.deleteDatabase()
        this.db = await this.openAndUpgradeDB()
        return this.db
      }
      throw error
    }
  }

  // ADDED: Opens the DB and ensures the store exists
  private async openAndUpgradeDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade: this.handleUpgrade.bind(this),
    })
  }

  // ADDED: Called during upgrade only
  private handleUpgrade(db: IDBPDatabase): void {
    if (!db.objectStoreNames.contains(this.storeName)) {
      console.info(`[IndexedDBProvider] Creating object store: ${this.storeName}`)
      db.createObjectStore(this.storeName)
    }
  }
}

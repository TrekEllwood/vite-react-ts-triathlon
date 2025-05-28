export interface IStorageProvider {
  save<T>(key: string, data: T): Promise<void> | void
  get<T>(key: string): Promise<T | null> | T | null
  delete(key: string): Promise<void> | void
}

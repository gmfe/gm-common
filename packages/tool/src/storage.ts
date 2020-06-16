import _ from 'lodash'

class StorageFactory {
  prefix: string
  target: Storage

  constructor(prefix: string, target: Storage) {
    this.prefix = prefix
    this.target = target
  }

  set(key: string, value: any): void {
    try {
      this.target.setItem(`${this.prefix}${key}`, JSON.stringify(value))
    } catch (err) {
      console.warn('Storage set error', err)
    }
  }

  get(key: string): any {
    const value = this.target.getItem(this.prefix + key)
    try {
      return value ? JSON.parse(value) : value
    } catch (err) {
      console.warn('Storage set error', err)
      // 如果 parse 错误，代表这个存储错误，认为就是没有这个存储，保持和没存储的表现一直，返回 null
      return null
    }
  }

  remove(key: string): void {
    this.target.removeItem(this.prefix + key)
  }

  clear(): void {
    this.target.clear()
  }

  getAll(): any {
    const result: { [key: string]: any } = {}
    const length = this.target.length
    _.each(_.range(length), (i) => {
      let key = this.target.key(i)
      if (key?.startsWith(this.prefix)) {
        key = key.slice(this.prefix.length)
        result[key] = this.get(key)
      }
    })
    return _.keys(result).length ? result : null
  }
}

// 为了区分 window.localStorage window.sessionStorage
// 估 LocalStorage SessionStorage
const LocalStorage = new StorageFactory('_gm-common_', window.localStorage)
const SessionStorage = new StorageFactory('_gm-common_', window.sessionStorage)
const Storage = LocalStorage

export { StorageFactory, Storage, LocalStorage, SessionStorage }
export default Storage

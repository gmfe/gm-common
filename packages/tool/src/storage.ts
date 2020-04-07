import { isNil, each, range, keys } from 'lodash'

const prefix = '_gm-common_'
const { localStorage } = window

export default class Storage {
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
    } catch (err) {
      console.warn('Storage set error', err)
    }
  }

  static get(key: string): unknown {
    const value = localStorage.getItem(prefix + key)
    try {
      return value ? JSON.parse(value) : value
    } catch (err) {
      console.warn('Storage set error', err)
      // 如果 parse 错误，代表这个存储错误，认为就是没有这个存储，保持和没存储的表现一直，返回 null
      return null
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(prefix + key)
  }

  static clear(): void {
    localStorage.clear()
  }

  static getAll(): unknown {
    const result: { [key: string]: any } = {}
    const length = localStorage.length
    each(range(length), (i) => {
      let key = localStorage.key(i)
      if (key?.startsWith(prefix)) {
        key = key.slice(prefix.length)
        result[key] = this.get(key)
      }
    })
    return keys(result).length ? result : null
  }
}

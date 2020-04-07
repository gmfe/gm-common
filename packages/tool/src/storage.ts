import { isNil, each, range, keys } from 'lodash'

const prefix = '_gm-common_'
const { localStorage } = window

export default class Storage {
  static set(key: string, value: any): void {
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
  }

  static get(key: string): unknown {
    const value = localStorage.getItem(prefix + key)
    return value ? JSON.parse(value) : value
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

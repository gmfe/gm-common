import _ from 'lodash'

const prefix = '_gm-common_'
const { localStorage } = window

const Storage = {
  set(key, value) {
    localStorage.setItem(prefix + key, JSON.stringify(value))
  },
  get(key) {
    const v = localStorage.getItem(prefix + key)
    return v ? JSON.parse(v) : v
  },
  remove(key) {
    localStorage.removeItem(prefix + key)
  },
  clear() {
    localStorage.clear()
  },
  getAll() {
    const result = {}
    _.each(_.range(localStorage.length), i => {
      let key = localStorage.key(i)
      if (key.startsWith(prefix)) {
        key = key.slice(prefix.length)
        result[key] = Storage.get(key)
      }
    })
    return _.keys(result) ? result : null
  }
}

export default Storage

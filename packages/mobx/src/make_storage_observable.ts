import { observe } from 'mobx'
import { Storage } from '@gm-common/tool'
import _ from 'lodash'

interface Options<T, D> {
  afterStorageGet?(name: keyof T, data: D): D
  beforeStorageSet?(name: keyof T, data: D): D
}

function makeStorageObservable<T extends Object>(
  /** this */
  target: T,
  /** 存储 key */
  key: string,
  /** 字段名 */
  annotations: (keyof T)[],
  options?: Options<T, any>,
) {
  const _options = Object.assign(
    {
      afterStorageGet: (_name: keyof T, data: any) => data,
      beforeStorageSet: (_name: keyof T, data: any) => data,
    },
    options,
  )

  // init data
  _.each(annotations, (name) => {
    const sD = Storage.get(`store_${key}_${name}`)
    if (sD !== null) {
      // @ts-ignore
      target[name] = _options.afterStorageGet(name, sD)
    }
  })

  // listener 监听全部变化
  observe(target, (change) => {
    const name = change.name as keyof T

    if (change.type === 'update' && annotations.includes(name)) {
      Storage.set(
        `store_${key}_${name}`,
        _options.beforeStorageSet(name, change.newValue),
      )
    }
  })
}

export default makeStorageObservable

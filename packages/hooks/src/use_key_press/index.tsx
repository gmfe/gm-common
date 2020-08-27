import { useCallback } from 'react'
import useEvent, { UseEventTargetType, EventOptions } from '../use_event'

export type KeyEvent = 'keyup' | 'keydown'
export interface UseKeyOptions {
  options?: EventOptions
  event?: KeyEvent
  target?: UseEventTargetType
}
export type KeyFilter =
  | null
  | undefined
  | string // 单键
  | number // 单键
  | (string | number[]) // 多个适配键
  | object // 组合键
  | ((event: any) => boolean) // 自定义filter

export type Handler = (event: KeyboardEvent) => void
const noopFunc = () => {}

const modifyKey: any = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey,
}

const getType = (obj: any) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase()
}

const createKeyFilterFunc = (keyFilter: any) => {
  const type = getType(keyFilter)
  if (type === 'function') {
    // 自定义filter
    return keyFilter
  } else if (type === 'string' || type === 'number') {
    // 单个string|number
    return (event: KeyboardEvent) => verifySingleKey(event, keyFilter)
  } else if (type === 'object') {
    // 组合键
    return (event: KeyboardEvent) => verifyCombineKey(event, keyFilter)
  } else if (type === 'array') {
    // 多种场景
    return (event: KeyboardEvent) =>
      keyFilter.some((item: any) => createKeyFilterFunc(item)(event)) // 递归最终为单个键(string|number)的情况来处理，存在符合即为真
  }

  return keyFilter ? () => true : () => false
}

const verifySingleKey = (event: KeyboardEvent, key?: any) => {
  return event.key + '' === key + ''
}

const verifyCombineKey = (event: KeyboardEvent, key?: any) => {
  let matchCount = 0
  const keyLength = Object.keys(key).length
  for (const k of Object.keys(key)) {
    if (event.key === k || (modifyKey[k] && modifyKey[k](event))) {
      matchCount++
    }
  }
  return matchCount === keyLength
}

const useKeyPress = (
  keyFilter: KeyFilter,
  handler: Handler = noopFunc,
  keyOptions: UseKeyOptions = {},
) => {
  const { options, event = 'keyup', target = document } = keyOptions

  const handlerKeyPress = useCallback(
    (event) => {
      const filterFunc = createKeyFilterFunc(keyFilter)
      if (filterFunc(event)) {
        handler(event)
      }
    },
    [keyFilter, handler],
  )

  useEvent(event, handlerKeyPress, target, options)
}

export default useKeyPress

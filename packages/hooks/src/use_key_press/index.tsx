import { useCallback, useRef } from 'react'
import useEvent, { UseEventTargetType } from '../use_event'

type KeyEvent = 'keyup' | 'keydown'
export interface UseKeyOptions {
  eventOptions?: AddEventListenerOptions
  eventName?: KeyEvent
  target?: UseEventTargetType
}
type FilterFunc = (event: KeyboardEvent) => boolean
export type KeyFilter =
  | string // 单键
  | object // 组合键
  | (string | object)[] // 多个适配键
  | FilterFunc // 自定义filter  个人认为应该要容许并处理null/undefined的情况。

export type KeyHandler = (event: KeyboardEvent) => void
const noopFunc = () => {}

interface ModifyKey {
  ctrl: FilterFunc
  shift: FilterFunc
  alt: FilterFunc
  meta: FilterFunc
  [propName: string]: any
}

const modifyKey: ModifyKey = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey,
}

const getType = (obj: any) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase()
}

const createKeyFilterFunc = (keyFilter: KeyFilter): FilterFunc | void => {
  const type = getType(keyFilter)
  if (type === 'function') {
    // 自定义filter
    return keyFilter as FilterFunc
  } else if (type === 'string') {
    // 单个string
    return (event: KeyboardEvent) => verifySingleKey(event, keyFilter as string)
  } else if (type === 'object') {
    // 组合键
    return (event: KeyboardEvent) =>
      verifyCombineKey(event, keyFilter as object)
  } else if (type === 'array') {
    // 多种场景
    return (event: KeyboardEvent) =>
      (keyFilter as []).some((item: KeyFilter) =>
        (createKeyFilterFunc as (keyFilter: KeyFilter) => FilterFunc)(item)(
          event,
        ),
      ) // 递归最终为单个键的情况来处理，存在符合即为真
  }
}

const verifySingleKey = (event: KeyboardEvent, key: string) => {
  return event.key === key
}

const verifyCombineKey = (event: KeyboardEvent, key: object) => {
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
  keyHandler: KeyHandler = noopFunc,
  keyOptions: UseKeyOptions = {},
) => {
  const { eventOptions, eventName = 'keyup', target = document } = keyOptions

  const keyHandlerRef = useRef(keyHandler)
  keyHandlerRef.current = keyHandler

  const handlerKeyPress = useCallback(
    (event) => {
      const filterFunc = createKeyFilterFunc(keyFilter)
      if ((filterFunc as FilterFunc)(event)) {
        keyHandlerRef.current(event)
      }
    },
    [keyFilter],
  )

  useEvent(eventName, handlerKeyPress, { target, eventOptions })
}

export default useKeyPress

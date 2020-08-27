import { MutableRefObject } from 'react'

export type TargetType<T> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>
export type DomType = HTMLElement | Window | Document
export type ResultType = DomType | null | undefined

// 处理不同的dom节点获取方式，useRef，createRef，Dom
const getDomTarget = (target?: TargetType<DomType>): ResultType => {
  let targetDom: ResultType

  if (!target) {
    return null
  }

  if (typeof target === 'function') {
    targetDom = target()
  } else if ('current' in target) {
    targetDom = target.current
  } else {
    targetDom = target
  }

  return targetDom
}

export default getDomTarget

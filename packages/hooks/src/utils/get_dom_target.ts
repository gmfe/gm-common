import { MutableRefObject } from 'react'

export type TargetDomType<T> = T | MutableRefObject<T | null>
export type DomType = HTMLElement | Window | Document
export type ResultDomType = DomType | null | undefined

// 处理不同的dom节点获取方式，useRef，Dom
const getTargetDom = (target: TargetDomType<DomType>): ResultDomType => {
  let targetDom: ResultDomType

  if ('current' in target) {
    targetDom = target.current
  } else {
    targetDom = target
  }

  return targetDom
}

export default getTargetDom

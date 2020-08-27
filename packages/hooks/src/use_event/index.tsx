import { useEffect } from 'react'
import getDomTarget, { TargetType, DomType } from '../utils/get_dom_target'

export type Handler = (event?: any) => void
export type UseEventTargetType = TargetType<DomType>
export type EventOptions = boolean | AddEventListenerOptions

const useEvent = (
  eventName: string,
  handler: Handler,
  target?: UseEventTargetType,
  options?: EventOptions,
): void => {
  useEffect(() => {
    const targetDom = getDomTarget(target)

    if (!targetDom || !handler) {
      return
    }

    targetDom.addEventListener(eventName, handler, options)

    return () => {
      if (!targetDom || !handler) {
        return
      }
      targetDom.removeEventListener(eventName, handler, options)
    }
  }, [target, handler, eventName, options])
}

export default useEvent

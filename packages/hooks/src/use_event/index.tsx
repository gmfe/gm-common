import { useEffect, useRef } from 'react'
import getDomTarget, { TargetDomType, DomType } from '../utils/get_dom_target'

export type UseEventTargetType = TargetDomType<DomType>
export interface UseEventOptions {
  eventOptions?: AddEventListenerOptions
  target?: UseEventTargetType
}

const useEvent = (
  eventName: string,
  handler: EventListener,
  useEventOptions: UseEventOptions = {},
): void => {
  const { eventOptions, target = window } = useEventOptions

  const eventHandlerRef = useRef(handler)
  eventHandlerRef.current = handler

  useEffect(() => {
    const targetDom = getDomTarget(target)

    if (!targetDom) {
      return
    }

    const eventListener: EventListener = (event) => {
      eventHandlerRef.current(event)
    }

    targetDom.addEventListener(eventName, eventListener, eventOptions)

    return () => {
      if (!targetDom) {
        return
      }
      targetDom.removeEventListener(eventName, eventListener, eventOptions)
    }
  }, [target, eventName, eventOptions?.passive, eventOptions?.once])
}

export default useEvent

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
  const { eventOptions = {}, target = window } = useEventOptions

  const eventHandlerRef = useRef(handler)
  const eventOptionsRef = useRef(eventOptions)

  eventHandlerRef.current = handler
  eventOptionsRef.current = eventOptions

  useEffect(() => {
    const targetDom = getDomTarget(target)

    if (!targetDom) {
      return
    }

    targetDom.addEventListener(
      eventName,
      eventHandlerRef.current,
      eventOptionsRef.current,
    )

    return () => {
      if (!targetDom) {
        return
      }
      targetDom.removeEventListener(
        eventName,
        eventHandlerRef.current,
        eventOptionsRef.current,
      )
    }
  }, [target, eventName])
}

export default useEvent

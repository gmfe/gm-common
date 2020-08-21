import { useCallback, useRef } from 'react'

function usePersistFn(fn: (...args: any[]) => any) {
  const refFun = useRef(fn)

  refFun.current = fn

  const persistFn = useCallback((...args) => {
    return refFun.current(...args)
  }, [])

  return persistFn
}

export default usePersistFn

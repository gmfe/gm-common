import { useEffect, useRef, useState } from 'react'

function useUnmount(fun?: () => void) {
  const [isUnmounted, setIsUnmounted] = useState(false)
  const refFun = useRef(fun)

  refFun.current = fun

  useEffect(() => {
    return () => {
      setIsUnmounted(true)
      refFun.current && refFun.current()
    }
  }, [])

  return isUnmounted
}

export default useUnmount

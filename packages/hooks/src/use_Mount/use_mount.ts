import { useRef } from 'react'

function useMount() {
  const isMountRef = useRef(false)

  if (!isMountRef.current) {
    isMountRef.current = true
    return false
  }
  return isMountRef.current
}
export default useMount

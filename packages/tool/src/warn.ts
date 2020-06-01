import { useEffect } from 'react'

function warn(...warn: any[]) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  console.warn('[react-gm warn]', ...warn)
}

const devWarnForHook = (callback: () => void): void => {
  devWarn(() => {
    useEffect(() => {
      callback()
    }, [])
  })
}

const devWarn = (callback: () => void): void => {
  if (process.env.NODE_ENV !== 'production') {
    callback()
  }
}

export { warn, devWarn, devWarnForHook }

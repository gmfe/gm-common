import { useEffect } from 'react'

function warn() {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  console.warn.apply(this, ['[react-gm warn] ', ...arguments])
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

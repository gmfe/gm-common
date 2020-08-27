import React, { useState } from 'react'

import useKeyPress from './index'

export const SingleKey = () => {
  const [key, setKey] = useState<string>()
  const handleResize = () => {
    setKey('o')
  }
  useKeyPress('o', handleResize, { event: 'keyup' })
  return <div>按下o: {key}</div>
}

export const CombinationKey = () => {
  const [key, setKey] = useState<object>()
  const keyFilter = { shift: true, I: true }
  const handleResize = () => {
    setKey(keyFilter)
  }
  useKeyPress(keyFilter, handleResize, { event: 'keyup' })
  return <div>按下shift+o: {JSON.stringify(key)}</div>
}

export const MultiKey = () => {
  const [key, setKey] = useState<any[]>()
  const keyFilter = [{ shift: true, I: true }, 0, 'e']
  const handleResize = () => {
    setKey(keyFilter)
  }
  useKeyPress(keyFilter, handleResize, { event: 'keyup' })
  return <div>按下shift+I/0/e: {JSON.stringify(key)}</div>
}

export const CustomizeKeyFilter = () => {
  const [key, setKey] = useState('')

  const handleKeyFilter = (event: any) => {
    if (event.key === 'c') {
      return true
    }

    return false
  }
  const handleResize = () => {
    setKey('c')
  }
  useKeyPress(handleKeyFilter, handleResize, { event: 'keyup' })
  return <div>按下c: {JSON.stringify(key)}</div>
}

export default {
  title: 'Hooks/state/useKeyPress',
}

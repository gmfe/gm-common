import React, { useState, useRef } from 'react'
import useEvent from './index'

export const Dom = () => {
  const [height, setHeight] = useState(0)

  const handleResize = () => {
    // 永远都是第一次生成的 handleResize，即 height 0
    console.log('height', height)
    setHeight(window.innerHeight)
  }
  useEvent('resize', handleResize, { target: window })
  return <div>监听window-resize事件,window.innerHeight: {height}</div>
}

export const RefDom = () => {
  const [count, setCount] = useState(0)
  const demoRef = useRef<HTMLDivElement>(null)
  const handleClick = (event: any) => {
    console.log(event, 'click')
    setCount((count) => count + 1)
  }
  useEvent('click', handleClick, { target: demoRef })
  return <div ref={demoRef}>监听click事件,点击次数: {count}</div>
}

export default {
  title: 'Hooks/state/useEvent',
}

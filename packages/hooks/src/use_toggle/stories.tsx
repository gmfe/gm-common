import React from 'react'
import useToggle from './index'

export const Normal = () => {
  const [state, { toggle, setLeft, setRight }] = useToggle()
  return (
    <div>
      <div>不提供参数，默认切换 boolean </div>
      state: {JSON.stringify(state)}
      <button
        onClick={() => {
          toggle()
        }}
      >
        toggle
      </button>
      <button
        onClick={() => {
          toggle(true)
        }}
      >
        toggle true
      </button>
      <button
        onClick={() => {
          setLeft()
        }}
      >
        setLeft
      </button>
      <button
        onClick={() => {
          setRight()
        }}
      >
        setRight
      </button>
    </div>
  )
}

export const HasParams = () => {
  const [state, { toggle }] = useToggle('固戍', '科兴')
  return (
    <div>
      <div>提供参数 </div>
      state: {JSON.stringify(state)}
      <button
        onClick={() => {
          toggle()
        }}
      >
        toggle
      </button>
    </div>
  )
}

export default {
  title: 'Hook/state/useToggle',
}

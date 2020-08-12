import React, { useState } from 'react'
import useUnmount from './index'

const A = () => {
  const isUnmounted = useUnmount(() => {
    console.log('unmounted')
  })

  console.log(isUnmounted)

  return <div>A</div>
}

export const Normal = () => {
  const [state, setState] = useState(1)

  return (
    <div>
      <A key={state} />
      <button
        onClick={() => {
          setState((state) => state + 1)
        }}
      >
        change key
      </button>
    </div>
  )
}

export default {
  title: 'Hook/life cycle/useUnmount',
}

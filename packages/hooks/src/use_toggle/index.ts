import { useState } from 'react'

type State = any
type Result = [any, Actions]

export interface Actions {
  toggle: (value?: State) => void
  setLeft: () => void
  setRight: () => void
}

function useToggleBase<T = State, D = State>(
  defaultValue: T,
  reverseValue: D,
): Result {
  const [state, setState] = useState<T | D>(defaultValue)

  const toggle = (value?: T | D) => {
    if (value !== undefined) {
      setState(value)
      return
    }

    setState(state === defaultValue ? reverseValue : defaultValue)
  }

  const setLeft = () => {
    setState(defaultValue)
  }

  const setRight = () => {
    setState(reverseValue)
  }

  const actions = {
    toggle,
    setLeft,
    setRight,
  }

  return [state, actions]
}

function useToggle<T = State, D = State>(
  defaultProps?: T,
  reverseValue?: D,
): Result {
  let left, right

  if (defaultProps === undefined || typeof defaultProps === 'object') {
    left = !!defaultProps
    right = !defaultProps
  } else {
    left = defaultProps
    right = reverseValue
  }

  return useToggleBase(left, right)
}

export default useToggle

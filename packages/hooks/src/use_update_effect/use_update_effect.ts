import { useEffect, EffectCallback, DependencyList } from 'react'
import { useMount } from '../use_Mount'
/**
 * @description: didMount后才执行的effect，加入isUpdateEffect作为开关控制
 */
const useUpdateEffect = (
  effect: EffectCallback,
  dep?: DependencyList,
  isUpdateEffect = true,
) => {
  let isMount = useMount()
  if (!isUpdateEffect) {
    isMount = true
  }
  useEffect(() => {
    if (isMount) {
      return effect()
    }
  }, dep)
}

export default useUpdateEffect

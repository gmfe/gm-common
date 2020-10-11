import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { Cache, promiseTaskOrder } from '@gm-common/tool'
import useUnmount from '../use_unmount'
import {
  UseAsyncService,
  UseAsyncOptions,
  UseAsyncResult,
  UseAsyncState,
} from './types'

interface DoSomeThink<P, D> {
  id: string
  setState: (state: UseAsyncState<P>) => void
  isUnmounted: boolean
  service: UseAsyncService<P, D>
  params?: P
  cacheKey?: string
  cacheTime: number
  onBeforeSuccess(data?: D, params?: P): void
  onSuccess(data?: D, params?: P): void
  onBeforeError(e: Error): void
  onError(e: Error): void
}

function _doSomeThink<P, D>(args: DoSomeThink<P, D>) {
  const {
    id,
    setState,
    isUnmounted,
    service,
    params,
    cacheKey,
    cacheTime,
    onBeforeSuccess,
    onSuccess,
    onBeforeError,
    onError,
  } = args

  let cacheData: any
  if (cacheKey) {
    cacheData = Cache.get(cacheKey)
  }

  // 如果有缓存数据就用缓存数据
  setState({
    data: cacheData !== undefined ? cacheData : undefined,
    loading: true,
    error: undefined,
    params,
  })

  const resolveFn = (resolveData: any) => {
    if (cacheKey && cacheTime > -1) {
      Cache.set(cacheKey, cacheTime, resolveData)
    }

    onBeforeSuccess(resolveData, params)

    // unmounted 后没有意义
    if (!isUnmounted) {
      setState({
        data: resolveData,
        loading: false,
        error: undefined,
        params,
      })
    }

    onSuccess(resolveData, params)

    return resolveData
  }

  const rejectFn = (rejectReason: any) => {
    // 失败缓存数据需要清除
    if (cacheKey) {
      Cache.remove(cacheKey)
    }

    onBeforeError(rejectReason)

    // unmounted 后没有意义
    if (!isUnmounted) {
      setState({
        data: undefined,
        loading: false,
        error: rejectReason,
        params,
      })
    }

    onError(rejectReason)

    // eslint-disable-next-line promise/no-return-wrap
    return Promise.reject(rejectReason)
  }

  // taskOrder 任务调度，任务多次调用的时候，响应最新的，旧的不响应
  return promiseTaskOrder(id, () => {
    return service(params)
  }).then(resolveFn, rejectFn)
}

/**
 * 异步（promise）管理
 * 且调度 service，保证响应最新一个
 */
function useAsync<P extends object = any, D = any>(
  service: UseAsyncService<P, D>,
  options?: UseAsyncOptions<P, D>,
): UseAsyncResult<P, D> {
  const _options = Object.assign(
    {
      manual: true,
      defaultParams: undefined,
      onBeforeSuccess: _.noop,
      onSuccess: _.noop,
      onBeforeError: _.noop,
      onError: _.noop,
      cacheKey: undefined,
      cacheTime: 5 * 60 * 1000,
    },
    options,
  )

  const refId = useRef((Math.random() + '').slice(2))
  const isUnmounted = useUnmount()

  const [state, setState] = useState<UseAsyncState<P>>({
    data: undefined,
    loading: false,
    error: undefined,
    params: _options.defaultParams,
  })

  // 不知道叫什么名字
  function doSomeThink(params?: P) {
    return _doSomeThink<P, D>({
      id: refId.current,
      setState,
      isUnmounted,
      service,
      params,
      cacheKey: _options.cacheKey,
      cacheTime: _options.cacheTime,
      onBeforeSuccess: _options.onBeforeSuccess,
      onSuccess: _options.onSuccess,
      onBeforeError: _options.onBeforeError,
      onError: _options.onError,
    })
  }

  useEffect(() => {
    // 非手动
    if (!_options.manual) {
      doSomeThink(_options.defaultParams)
    }
  }, [])

  const run = (params?: P) => {
    // 没参数，就用默认的参数
    return doSomeThink(params || _options.defaultParams)
  }

  const refresh = () => {
    // 用上次的
    return doSomeThink(state.params)
  }

  return {
    data: state.data,
    params: state.params,
    loading: state.loading,
    error: state.error,
    run,
    refresh,
  }
}

export default useAsync

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'

type RequestFn = (
  r?: { _axiosConfig?: AxiosRequestConfig },
  codes?: number[],
) => Promise<any>

type AutoCancelReturn<T extends RequestFn> = T & {
  /** 取消请求 */
  cancel(): void
}
/**
 * @description 传入原接口，返回一个自动取消请求的接口
 * @example
 * const ListOrderWithRelationAutoCancel = autoCancel(ListOrderWithRelation)
 * // 能够自动取消请求
 * ListOrderWithRelationAutoCancel()
 * // 手动取消请求
 * ListOrderWithRelationAutoCancel.cancel()
 */
function autoCancel<T extends RequestFn>(request: T): AutoCancelReturn<T> {
  let cancelTokenSource: null | CancelTokenSource = null
  /** 取消请求 */
  function cancel() {
    if (cancelTokenSource) {
      ;(cancelTokenSource as CancelTokenSource).cancel()
    }
  }
  const proxyRequest = (
    r?: { _axiosConfig?: AxiosRequestConfig },
    codes?: number[],
  ) => {
    cancel()
    let { _axiosConfig = {}, ...restArgs } = r || {}
    cancelTokenSource = axios.CancelToken.source()
    _axiosConfig = {
      ..._axiosConfig,
      cancelToken: cancelTokenSource.token,
    }
    return request({ _axiosConfig, ...restArgs }, codes)
  }
  return proxyRequest as T & { cancel(): void }
}

export default autoCancel

import _ from 'lodash'
import { Service } from '../use_async/type'
import useAsync from '../use_async'
import useUnmount from '../use_unmount'
import { useState } from 'react'
import {
  Paging,
  Params,
  ResolveData,
  Options,
  Result,
  PagingRequest,
} from './types'

const DEFAULT_PAGING_REQUEST = {
  offset: 0,
  limit: 10,
  need_count: false,
}

/**
 * 约定 service 返回 { paging }
 * 注意，为了性能考虑，count 只有 offset = 0 need_count = true 时才返回
 */
function usePagination(service: Service, options?: Options): Result {
  const isUnmounted = useUnmount()

  const defaultPaging = options?.defaultParams?.paging || {}
  const [state, setState] = useState<Paging>({
    offset: 0,
    limit: defaultPaging.limit ?? DEFAULT_PAGING_REQUEST.limit,
    need_count: defaultPaging.need_count ?? DEFAULT_PAGING_REQUEST.need_count,
    has_more: false,
    count: 0,
  })

  const asyncResult = useAsync(
    service,
    _.merge({}, options, {
      defaultParams: {
        paging: {
          offset: state.offset,
          limit: state.limit,
          need_count: state.need_count,
        },
      },
      onSuccess(resolveData: ResolveData, params: any) {
        // 这种从后台回来的数据严谨点，做个 paging 兼容 {}
        if (!resolveData || !resolveData.paging) {
          console.warn('约定页码需要返回 paging')
          return
        }

        // 这种从后台回来的数据严谨点，做个 paging 兼容 {}
        const pagingRes = resolveData.paging || {}
        const pagingRequest = params?.paging

        if (!isUnmounted) {
          setState((s) => {
            return _.merge(
              {},
              s,
              {
                offset: pagingRequest.offset,
                limit: pagingRequest.limit,
                need_count: pagingRequest.need_count,
              },
              // 这种从后台回来的数据严谨点，一个一个字段写进去，而不是 ...pagingRes
              {
                has_more: !!pagingRes.has_more,
                // 特殊。只有 need_count true offset 0 的时候才吐 count
                // 这里，只有后台提供 count 回来才赋值，否则用之前的
                count:
                  pagingRes.count !== undefined ? pagingRes.count : s.count,
              },
            )
          })
        }
        options && options.onSuccess && options.onSuccess(resolveData, params)
      },
    }),
  )

  const runChangePaging = (pagingReq: PagingRequest) => {
    return asyncResult.run({
      ...asyncResult.params,
      paging: {
        offset: pagingReq.offset ?? state.offset,
        limit: pagingReq.limit ?? state.limit,
        need_count: pagingReq.need_count ?? state.need_count,
      },
    })
  }

  // 较为复杂
  const run = (params?: Params) => {
    const newParams = {
      ...params,
      // 有 paging
      paging: _.merge({}, DEFAULT_PAGING_REQUEST, params?.paging),
    }

    return asyncResult.run(newParams)
  }

  const refresh = () => {
    // 不能用 asyncResult的refresh
    // return asyncResult.refresh()

    return runChangePaging({})
  }

  return {
    data: asyncResult.data,
    params: asyncResult.params as Params,
    loading: asyncResult.loading,
    error: asyncResult.error,
    paging: state,
    run,
    refresh,
    runChangePaging,
  }
}

export default usePagination

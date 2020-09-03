import _ from 'lodash'
import { Service } from '../use_async/type'
import useAsync from '../use_async'
import useUnmount from '../use_unmount'
import { useState } from 'react'
import { Paging, ResolveData, Options, Result, PagingRequest } from './type'

/**
 * 约定 service 返回 { paging }
 * 注意，为了性能考虑，count 只有 offset = 0 need_count = true 时才返回
 */
function usePagination(service: Service, options?: Options): Result {
  const paging = options?.defaultParams?.paging || {}

  const isUnmounted = useUnmount()
  const [state, setState] = useState<Paging>({
    offset: 0,
    limit: paging.limit || 10,
    need_count: paging.need_count || false,
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

        if (!isUnmounted) {
          setState((s) => {
            return {
              ...s,
              // 这种从后台回来的数据严谨点，一个一个字段写进去，而不是 ...pagingRes
              has_more: !!pagingRes.has_more,
              // 特殊。只有 need_count true offset 0 的时候才吐 count
              // 这里，只有后台提供 count 回来才赋值，否则用之前的
              count: pagingRes.count !== undefined ? pagingRes.count : s.count,
            }
          })
        }
        options && options.onSuccess && options.onSuccess(resolveData, params)
      },
    }),
  )

  const runWithPaging = (pagingReq: PagingRequest) => {
    setState((s) => {
      return {
        ...s,
        offset: pagingReq.offset !== undefined ? pagingReq.offset : s.offset,
        limit: pagingReq.limit !== undefined ? pagingReq.limit : s.limit,
      }
    })

    return asyncResult.run({
      ...asyncResult.params,
      paging: {
        ...state,
        ...pagingReq,
      },
    })
  }

  return {
    ...asyncResult,
    paging: state,
    runWithPaging,
  }
}

export default usePagination

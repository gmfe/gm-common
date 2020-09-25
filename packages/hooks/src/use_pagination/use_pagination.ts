import _ from 'lodash'
import { useAsync } from '../use_async'
import useUnmount from '../use_unmount'
import { useRef } from 'react'
import {
  UsePaginationService,
  UsePaginationOptions,
  UsePaginationPaging,
  UsePaginationParams,
  UsePaginationResolveData,
  UsePaginationResult,
  UsePaginationPagingReq,
} from './types'
import { LocalStorage } from '@gm-common/tool'

const DEFAULT_PAGING_REQ = {
  offset: 0,
  limit: 10,
  need_count: false,
}

/**
 * 约定 service 返回 { paging }
 * 注意，为了性能考虑，count 只有 offset = 0 need_count = true 时才返回
 */
function usePagination(
  service: UsePaginationService,
  options?: UsePaginationOptions,
): UsePaginationResult {
  const paginationKey = '_use_pagination_key_' + options?.paginationKey
  const isUnmounted = useUnmount()

  const defaultPaging = _.merge(
    {},
    DEFAULT_PAGING_REQ,
    {
      limit: options?.paginationKey
        ? LocalStorage.get(paginationKey) || undefined
        : undefined,
    },
    options?.defaultPaging,
  )

  // 用 ref 处理，状态的更新 靠 useAsync 更新而跟新
  const refState = useRef<UsePaginationPaging>({
    ...defaultPaging,
    has_more: false,
    count: 0,
  })

  const asyncResult = useAsync(
    service,
    _.merge({}, options, {
      // 带给 useAsync
      defaultParams: {
        paging: defaultPaging,
      },
      onBeforeSuccess(
        resolveData: UsePaginationResolveData,
        params: UsePaginationParams,
      ) {
        // 这种从后台回来的数据严谨点，做个 paging 兼容 {}
        if (!resolveData || !resolveData.paging) {
          console.warn('约定页码需要返回 paging')
          return
        }
        const pagingRes = resolveData.paging || {}

        // 从请求 params 上取当前的页码数据
        const pagingReq = params?.paging || {}

        // 存起来
        if (options?.paginationKey && pagingReq.limit) {
          LocalStorage.set(paginationKey, pagingReq.limit)
        }

        if (!isUnmounted) {
          refState.current = _.merge(
            {},
            refState.current,
            pagingReq,
            // 这种从后台回来的数据严谨点，一个一个字段写进去，而不是 ...pagingRes。
            // 比如可能他们会有多语的字段，这样就污染了
            {
              has_more: !!pagingRes.has_more,
              // 特殊。只有 need_count true offset 0 的时候 count 才有意义。 没意义的时候 count 后台会吐 0，需要忽略
              // 这里，只有后台提供 count 回来才赋值，否则用之前的
              count:
                pagingReq.offset === 0
                  ? pagingRes.count
                  : refState.current.count,
            },
          )
        }

        options && options.onSuccess && options.onSuccess(resolveData, params)
      },
    }),
  )

  const runChangePaging = (pagingReq: UsePaginationPagingReq) => {
    return asyncResult.run({
      ...asyncResult.params,
      paging: {
        offset: pagingReq.offset ?? refState.current.offset,
        limit: pagingReq.limit ?? refState.current.limit,
        need_count: pagingReq.need_count ?? refState.current.need_count,
      },
    })
  }

  // 较为复杂
  const run = (params?: UsePaginationParams) => {
    const newParams = {
      ...params,
      // paging
      paging: _.merge(
        {},
        defaultPaging, // 默认分页信息
        params?.paging, // 传递的分页信息
      ),
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
    params: asyncResult.params as UsePaginationParams,
    loading: asyncResult.loading,
    error: asyncResult.error,
    paging: refState.current,
    run,
    refresh,
    runChangePaging,
  }
}

export default usePagination

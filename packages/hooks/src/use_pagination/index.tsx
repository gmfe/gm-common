import _ from 'lodash'
import { Service, Options } from '../use_async/type'
import useAsync from '../use_async'
import { useState } from 'react'
import { Paging, ResolveData, Result, PagingOptions } from './type'

/**
 * 约定 service 返回 { paging }
 */
function usePagination(service: Service, options?: Options): Result {
  const paging = options?.defaultParams?.paging || {}

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
        if (!resolveData || !resolveData.paging) {
          console.warn('约定页码需要返回 paging')
          return
        }

        const pagingRes = resolveData.paging || {}

        setState((s) => ({
          ...s,
          paging: pagingRes,
        }))
        options && options.onSuccess && options.onSuccess(resolveData, params)
      },
    }),
  )

  const runWithPaging = (paging: PagingOptions) => {
    asyncResult.run({
      ...asyncResult.params,
      paging: {
        ...state,
        ...paging,
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

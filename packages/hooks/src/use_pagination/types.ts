import { UseAsyncService, UseAsyncOptions } from '../use_async/types'
import { PagingReq } from '../types'

// usePagination 提供的，用于给 Pagination 展现，只有 count 可能无，其他都有
interface UsePaginationPaging {
  offset: number
  limit: number
  need_count: boolean
  has_more: boolean
  /** 注意，为了性能考虑，count 只有 offset = 0 need_count = true 时才返回 */
  count?: number
}

type UsePaginationService<P, D> = UseAsyncService<P, D>

interface UsePaginationOptions<P, D> extends UseAsyncOptions<P, D> {
  /** 默认 offset 0 limit 10 need_count false */
  defaultPaging?: PagingReq
  /** 页码key，目前用来记忆 limit */
  paginationKey?: string
}

interface UsePaginationResult<P = any, D = any> {
  data?: D
  /** 返回有 params，带有 paging */
  params: P
  loading: boolean
  error?: Error

  paging: UsePaginationPaging

  /** 用此方法 默认翻页信息回到默认 */
  run: (params?: P) => Promise<D>
  /** 会带上当前的翻页信息 */
  refresh: () => Promise<D>
  /** 只用来翻页 */
  runChangePaging: (paging: PagingReq) => Promise<D>
  pagination: {
    paging: UsePaginationPaging
    onChange: (paging: PagingReq) => Promise<D>
  }
  /** 对应删除的刷新，如果当前页有10条数据，一次性删除了10条，那么会调用run跳到第一条，否则调用refresh刷新当前页 */
  refreshAfterDelete: (list: any[], delNum: number) => Promise<D>
}

export type {
  UsePaginationService,
  UsePaginationPaging,
  UsePaginationOptions,
  UsePaginationResult,
}

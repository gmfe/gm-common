import {
  UseAsyncParams,
  UseAsyncService,
  UseAsyncOptions,
} from '../use_async/types'

type Data = any

// 用于请求
interface UsePaginationPagingReq {
  offset?: number
  /** 默认 10 */
  limit?: number
  /** 默认 false */
  need_count?: boolean
}

// 后台返回的
interface UsePaginationPagingRes {
  has_more: boolean
  count?: number
}

// usePagination 提供的，用于给 Pagination 展现，只有 count 可能无，其他都有
interface UsePaginationPaging {
  offset: number
  limit: number
  need_count: boolean
  has_more: boolean
  /** 注意，为了性能考虑，count 只有 offset = 0 need_count = true 时才返回 */
  count?: number
}

interface UsePaginationParams extends UseAsyncParams {
  paging?: UsePaginationPagingReq
}

type UsePaginationService = UseAsyncService

interface UsePaginationOptions extends UseAsyncOptions {
  /** 默认 offset 0 limit 10 need_count false */
  defaultPaging?: UsePaginationPagingReq
  /** 页码key，目前用来记忆 limit */
  paginationKey?: string
}

interface UsePaginationResult {
  data?: Data
  params: UsePaginationParams
  loading: boolean
  error?: Error

  paging: UsePaginationPaging

  /** 用此方法 默认翻页信息回到默认 */
  run: (params?: UsePaginationParams) => Promise<Data>
  /** 会带上当前的翻页信息 */
  refresh: () => Promise<Data>
  /** 只用来翻页 */
  runChangePaging: (paging: UsePaginationPagingReq) => Promise<Data>
}

interface UsePaginationResolveData {
  paging: UsePaginationPagingRes
}

export type {
  UsePaginationService,
  UsePaginationParams,
  UsePaginationPagingReq,
  UsePaginationPagingRes,
  UsePaginationPaging,
  UsePaginationOptions,
  UsePaginationResult,
  UsePaginationResolveData,
}

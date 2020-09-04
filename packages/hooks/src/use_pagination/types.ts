import {
  Data,
  Options as UseAsyncOptions,
  Result as UseAsyncResult,
} from '../use_async/type'

interface PagingRequest {
  offset?: number
  limit?: number
  need_count?: boolean
}

interface PagingResponse {
  has_more: boolean
  count?: number
}

// 偏 usePagination 提供的，只有 count 可能无，其他都有
interface Paging {
  offset: number
  limit: number
  need_count: boolean

  has_more: boolean
  count?: number
}

interface Params {
  paging?: PagingRequest
  [key: string]: any
}

type Service = (params?: Params) => Promise<any>

interface Options extends UseAsyncOptions {
  defaultParams?: Params
}

// result 的 params 会提供完整的 PagingRequest 信息
interface ResultParams {
  paging: {
    offset: number
    limit: number
    need_count: boolean
  }
  [key: string]: any
}

interface Result extends UseAsyncResult {
  data?: Data
  params: ResultParams
  loading: boolean
  error?: Error
  paging: Paging
  /** 用此方法注意 paging 信息。没有则翻页信息回到默认 */
  run: (params?: Params) => Promise<Data>
  refresh: () => Promise<Data>
  /** 只用来翻页 */
  runChangePaging: (paging: PagingRequest) => Promise<Data>
}

interface ResolveData {
  paging: PagingResponse
}

export type {
  Service,
  Params,
  ResultParams,
  PagingRequest,
  PagingResponse,
  Paging,
  Options,
  Result,
  ResolveData,
}

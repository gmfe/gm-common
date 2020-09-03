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

// 偏 usePagination 提供的，只有 count 可能无，其他都可能有
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

interface Options extends UseAsyncOptions {
  defaultParams?: Params
}

interface Result extends UseAsyncResult {
  paging: Paging
  runWithPaging: (paging: PagingRequest) => Promise<Data>
}

interface ResolveData {
  paging: PagingResponse
}

export type {
  PagingRequest,
  PagingResponse,
  Paging,
  Options,
  Result,
  ResolveData,
}

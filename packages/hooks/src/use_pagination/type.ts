import { Result as UseAsyncResult } from '../use_async/type'

// TODO
export interface PagingRequest {
  offset?: number
  limit?: number
  need_count?: boolean
  // sort_by:
}

export interface PagingResponse {
  has_more: boolean
  count?: number
}

export interface Paging extends PagingRequest, PagingResponse {}

export interface PagingOptions {
  limit?: number
  need_count?: boolean
}

export interface Result extends UseAsyncResult {
  paging: Paging
  runWithPaging: (paging: PagingRequest) => void
}

export interface ResolveData {
  paging: PagingResponse
}

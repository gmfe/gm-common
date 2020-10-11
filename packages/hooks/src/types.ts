// 用于请求
interface PagingReq {
  offset?: number
  /** 默认 10 */
  limit?: number
  /** 默认 false */
  need_count?: boolean
}

// 后台返回的
interface PagingRes {
  has_more: boolean
  count?: number
}

export type { PagingReq, PagingRes }

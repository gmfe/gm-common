export type Params = any

export type Data = any

export type Service = (params?: Params) => Promise<any>

export interface Options {
  /** 手动，true 则需要自己调用 run */
  manual?: boolean
  defaultParams?: Params
  onSuccess?: (data?: Data, params?: Params) => void
  onError?: (e: Error) => void
  /** 内存级别的数据缓存，设置的话会优先返回缓存数据，之后会请求数据更新。使用此选项注意 data 和 loading 的配合，如果 data 有数据，loading true，UI 不显示 loading 态 */
  cacheKey?: string
  /** cacheKey 存在才生效，默认 5 分钟 */
  cacheTime?: number
}

export interface Result {
  data?: Data
  params?: Params
  loading: boolean
  error?: Error
  run: (params?: Params) => Promise<Data>
  refresh: () => Promise<Data>
}

export interface State {
  data?: any
  loading: boolean
  error?: Error
  params?: Params
}

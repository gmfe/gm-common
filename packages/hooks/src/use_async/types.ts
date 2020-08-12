type UseAsyncParams = {
  [key: string]: any
}

type Data = any

type UseAsyncService = (params?: UseAsyncParams) => Promise<any>

interface UseAsyncOptions {
  /** 手动，true 则需要自己调用 run */
  manual?: boolean
  defaultParams?: UseAsyncParams
  /** 和 onSuccess 区别是在 state 改变之前触发。目前用来减少更上层hook 的 render 次数，上层不需要用状态更新来 render，只需要 keep 引用。更新由 useAsync 触发即可。 */
  onBeforeSuccess?(data?: Data, params?: UseAsyncParams): void
  onSuccess?(data?: Data, params?: UseAsyncParams): void
  onBeforeError?(e: Error): void
  onError?(e: Error): void
  /** 内存级别的数据缓存，设置的话会优先返回缓存数据，之后会请求数据更新。使用此选项注意 data 和 loading 的配合，如果 data 有数据，loading true，UI 不显示 loading 态 */
  cacheKey?: string
  /** cacheKey 存在才生效，默认 5 分钟 */
  cacheTime?: number
}

interface UseAsyncResult {
  data?: Data
  params?: UseAsyncParams
  loading: boolean
  error?: Error
  /** 如果不提供 params，则取 defaultParams */
  run(params?: UseAsyncParams): Promise<Data>
  /** 是用上次的参数 */
  refresh(): Promise<Data>
}

interface UseAsyncState {
  data?: any
  loading: boolean
  error?: Error
  params?: UseAsyncParams
}

export type {
  Data,
  UseAsyncState,
  UseAsyncParams,
  UseAsyncService,
  UseAsyncOptions,
  UseAsyncResult,
}

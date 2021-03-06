import axios, { AxiosInstance } from 'axios'
import { instance } from './request'
import { isProduction } from './util'
import {
  traceRequestInterceptor,
  traceResponseInterceptor,
} from './config_trace'

// 默认最大重试次数
const defaultRetryMaxCount: number = 2
// 默认重试延迟时间
const defaultRetryDelay: number = 500

const doRetryInterceptors = (
  retryInstance: AxiosInstance,
  opts: {
    retryMaxCount: number
    retryDelay: number
    canRequest?: () => boolean
  },
) => {
  retryInstance.interceptors.request.use((config: any) => {
    if (!config.retryMaxCount) {
      config.retryMaxCount = opts.retryMaxCount
    }

    if (!config.retryDelay) {
      config.retryDelay = opts.retryDelay
    }
    config.headers['X-Guanmai-Request-Retry'] = config._currentRetryCount || 1
    return traceRequestInterceptor(opts, config)
  })

  retryInstance.interceptors.response.use(
    traceResponseInterceptor,
    (error: any) => {
      const config = error.config
      config._currentRetryCount = config._currentRetryCount || 1
      if (
        config.retryMaxCount &&
        config._currentRetryCount < config.retryMaxCount
      ) {
        config._currentRetryCount += 1

        const backOff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve()
          }, config.retryDelay)
        })

        return backOff.then(function () {
          return retryInstance(config)
        })
      } else {
        return Promise.reject(error)
      }
    },
  )
}

// 注意执行时机
function configRetry(opts?: {
  retryMaxCount: number
  retryDelay: number
  canRequest?: () => boolean
}): void {
  const retryMaxCount = opts?.retryMaxCount || defaultRetryMaxCount
  const retryDelay = opts?.retryDelay || defaultRetryDelay

  instance.interceptors.request.use((config: any) => {
    config.headers['X-Guanmai-Request-Retry'] = 0
    return config
  })

  instance.interceptors.response.use(undefined, async (error: any) => {
    const config = error.config
    // 先仅对get 做超时重试
    if (
      isProduction &&
      config.method === 'get' &&
      error.message &&
      error.message.includes('timeout')
    ) {
      const retryInstance = axios.create()
      doRetryInterceptors(retryInstance, {
        retryMaxCount,
        retryDelay,
        canRequest: opts?.canRequest,
      })
      return await retryInstance(config)
    } else {
      return Promise.reject(error)
    }
  })
}

export default configRetry

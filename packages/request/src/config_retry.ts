import axios from 'axios'
import { instance } from './request'
import { isProduction } from './util'

const defaultRetryMaxCount: number = 3
const defaultRetryDelay: number = 1

function configRetry(opts: {
  retryMaxCount: number
  retryDelay: number
}): void {
  const retryMaxCount = opts.retryMaxCount || defaultRetryMaxCount
  const retryDelay = opts.retryDelay || defaultRetryDelay

  instance.interceptors.request.use((config: any) => {
    if (!config.retry) {
      config.retry = retryMaxCount
    }

    if (!config.retryDelay) {
      config.retryDelay = retryDelay
    }

    return config
  })

  instance.interceptors.response.use(undefined, (error: any) => {
    const config = error.config
    // 先仅对get 做超时重试
    if (
      isProduction &&
      config.method === 'get' &&
      error.message &&
      error.message.includes('timeout')
    ) {
      config._currentRetryCount = config._currentRetryCount || 0
      if (config.retry && config._currentRetryCount < config.retry) {
        config._currentRetryCount += 1

        var backOff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve()
          }, config.retryDelay || retryDelay)
        })

        return backOff.then(function () {
          return axios(config)
        })
      }
    }
  })
}

export default configRetry

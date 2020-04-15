import { instance } from './request'
import { feed, requestUrl, requestEnvUrl, platform, isProduction } from './util'

function doInterceptors(options: { [key: string]: any } = {}): void {
  const timeMap: { [key: string]: any } = {}
  instance.interceptors.request.use((config) => {
    const requestId = config.headers['X-Guanmai-Request-Id']
    timeMap[requestId] = Date.now()

    const { url, params, data } = config
    if (options.canRequest && options.canRequest(url)) {
      feed(requestUrl + platform, {
        url,
        params: JSON.stringify(params),
        data: JSON.stringify(data),
        requestId,
        reqTime: new Date() + '',
      })
    }

    return config
  })
  instance.interceptors.response.use(
    (response) => {
      const json = response.data
      const { url, headers, params, data } = response.config
      const requestId = headers['X-Guanmai-Request-Id']

      feed(requestUrl + platform, {
        url,
        params: JSON.stringify(params),
        data: JSON.stringify(data),
        requestId,
        resCode: json.code,
        resMsg: json.msg,
        resTime: new Date() + '',
        time: timeMap[requestId] ? Date.now() - timeMap[requestId] : '',
      })

      // 释放内存
      if (timeMap[requestId]) {
        delete timeMap[requestId]
      }

      return response
    },
    (error) => {
      // 就不上报了，意义不大
      return Promise.reject(error)
    },
  )
}

function configTrace(options?: { [key: string]: any }): void {
  if (!isProduction) {
    return
  }

  // 首次上报
  // 因为是一次上报，所以获取 getCacheFingerPrint 即可，有就有，没有就没有
  feed(requestEnvUrl + platform)

  // 添加中间件
  doInterceptors(options)
}

export default configTrace

import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { instance } from './request'
import { requestUrl, requestEnvUrl, platform, isProduction } from './util'
import { report } from '@gm-common/analyse'
const timeMap: { [key: string]: any } = {}
const callTimesMap: { [key: string]: any } = {}

export function traceRequestInterceptor(
  options: { [key: string]: any },
  config: AxiosRequestConfig,
) {
  const requestId = config.headers['X-Guanmai-Request-Id']
  const retryTimes = config.headers['X-Guanmai-Request-Retry'] || 0
  timeMap[requestId] = Date.now()
  const { url, params, data, method } = config
  const callTimesKey = `${method}::${url}`

  if (callTimesMap[callTimesKey]) {
    callTimesMap[callTimesKey]++
  } else {
    callTimesMap[callTimesKey] = 1
  }

  if (options.canRequest && options.canRequest(url)) {
    report(requestUrl + platform, {
      url,
      requestId,
      retryTimes,
      params: JSON.stringify(params),
      data: JSON.stringify(data),
      callTimes: callTimesMap[callTimesKey],
      reqTime: new Date() + '',
    })
  }

  return config
}

export function traceResponseInterceptor(response: AxiosResponse<any>) {
  const json = response.data
  const { url, headers, params, data, method } = response.config
  const requestId = headers['X-Guanmai-Request-Id']
  const retryTimes = headers['X-Guanmai-Request-Retry'] || 0
  const callTimesKey = `${method}::${url}`

  report(requestUrl + platform, {
    url,
    params: JSON.stringify(params),
    data: JSON.stringify(data),
    requestId,
    retryTimes,
    resCode: json.code,
    resMsg: json.msg,
    resTime: new Date() + '',
    callTimes: callTimesMap[callTimesKey],
    time: timeMap[requestId] ? Date.now() - timeMap[requestId] : '',
  })

  // 释放内存
  if (timeMap[requestId]) {
    delete timeMap[requestId]
  }

  return response
}

function doInterceptors(options: { [key: string]: any } = {}): void {
  instance.interceptors.request.use(traceRequestInterceptor.bind(null, options))
  instance.interceptors.response.use(traceResponseInterceptor, (error) => {
    // 就不上报了，意义不大
    return Promise.reject(error)
  })
}

function configTrace(options?: { [key: string]: any }): void {
  // if (!isProduction) {
  //   return
  // }
  //TODO trace.guanmai.cn停用了，所以不用再请求了
  // 首次上报
  // report(requestEnvUrl + platform, {})

  // 添加中间件
  // doInterceptors(options)
}

export default configTrace

import _ from 'lodash'
import { getLocale } from '@gm-common/locales'

const platform = __NAME__ // eslint-disable-line

const isProduction = __PRODUCTION__ // eslint-disable-line

const requestUrl = '//trace.guanmai.cn/api/logs/request/'
const requestEnvUrl = '//trace.guanmai.cn/api/logs/environment/'

const isFile = function (v: object): boolean {
  return /\[object File]|\[object Blob]/.test(toString.call(v))
}

const isFiles = function (v: any[]): boolean {
  return toString.call(v) === '[object Array]' && isFile(v[0])
}

function hasFileData(data: any[]): boolean {
  return !!_.find(data, (v) => isFile(v) || isFiles(v))
}

function param(obj: object): string {
  // encodeURIComponent
  return _.map(obj, function (v, k) {
    return [encodeURIComponent(k), '=', encodeURIComponent(v)].join('')
  })
    .join('&')
    .replace(/%20/g, '+')
}

function processPostData(data: any) {
  let body: any

  if (toString.call(data) !== '[object Object]') {
    // json string 和 其他情况
    body = data
  } else {
    // object

    // 过滤null  undefined 只Object 类型。
    // 会修改，所以 ...
    data = _.pickBy({ ...data }, (value) => {
      return value !== null && value !== undefined
    })

    // file 用 FormData
    if (hasFileData(data)) {
      body = new window.FormData()

      _.forEach(data, (v, k) => {
        // 还有这种情况？
        if (isFiles(v)) {
          _.each(v, (file) => {
            body.append(k, file, file.name)
          })
        } else if (isFile(v)) {
          body.append(k, v, v.name)
        } else {
          body.append(k, v)
        }
      })
    } else {
      // 常规的对象
      body = param(data)
    }
  }

  return body
}

function getErrorMessage(error: { [key: string]: any }): string {
  let message
  const requestId = error?.config?.headers?.['X-Guanmai-Request-Id']
  if (error.response) {
    message = `${error.response.status} ${error.response.statusText}`
  } else if (error.request) {
    if (error.message && error.message.includes('timeout')) {
      message = getLocale('连接超时')
    } else {
      message = getLocale('服务器错误')
    }
  } else {
    message = error.message
  }

  return `${message}${requestId ? `\nrequestId:${requestId}` : ''}`
}

function getEntryTiming(entry: { [key: string]: any }) {
  const t = entry
  const times: { [key: string]: any } = {}
  times.redirect = t.redirectEnd - t.redirectStart
  // DNS
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart
  // 内容加载完成的时间
  times.request = t.responseEnd - t.requestStart
  // TCP 握手时间
  times.connect = t.connectEnd - t.connectStart
  times.duration = t.duration
  times.name = t.name
  return times
}

function getPerformanceInfo() {
  const info: { [key: string]: any } = {}
  if (window.performance) {
    const entries = _.filter(
      window.performance.getEntriesByType('resource'),
      (entry: { initiatorType: string }) =>
        entry.initiatorType === 'xmlhttprequest',
    )
    info.times = _.map(entries, (entry: { [key: string]: any }) =>
      getEntryTiming(entry),
    )
  }
  return info
}

export {
  requestUrl,
  requestEnvUrl,
  platform,
  isProduction,
  getPerformanceInfo,
  processPostData,
  hasFileData,
  getErrorMessage,
}

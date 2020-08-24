import _ from 'lodash'
import { getLocale } from '@gm-common/locales'

const platform = __NAME__ // eslint-disable-line

const isProduction = __PRODUCTION__ // eslint-disable-line

const requestUrl = '//trace.guanmai.cn/api/logs/request/'
const requestEnvUrl = '//trace.guanmai.cn/api/logs/environment/'
const gRpcMsgKey = 'GRPC_MSG_MAP'
const accessTokenKey = 'ACCESS_TOEKN_KEY'
const authInterfaceKey = 'AUTH_INTERFACE_KEY'

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

  return message
}

function atob(s: string): any {
  if (!s) return null
  try {
    const result = s.split('|').slice(1).join('|')
    if (!result) return null
    return JSON.parse(window.atob(result))
  } catch (error) {
    console.warn(error.message)
    return null
  }
}

export {
  gRpcMsgKey,
  accessTokenKey,
  authInterfaceKey,
  requestUrl,
  requestEnvUrl,
  platform,
  isProduction,
  processPostData,
  hasFileData,
  getErrorMessage,
  atob,
}

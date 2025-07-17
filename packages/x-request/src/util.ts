import _ from 'lodash'
import { getLocale } from '@gm-common/locales'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { decode } from 'js-base64'

const platform = __NAME__ // eslint-disable-line

const isProduction = __PRODUCTION__ // eslint-disable-line

const requestUrl = '//trace.guanmai.cn/api/logs/request/'
const requestEnvUrl = '//trace.guanmai.cn/api/logs/environment/'
const accessTokenKey = 'ACCESS_TOKEN_KEY'
const authInfoKey = 'AUTH_INTERFACE_KEY'

function getErrorMessage(error: { [key: string]: any }): string {
  let message
  if (error.response) {
    message = `${error.response.status} ${error.response.statusText}`
  } else if (error.request) {
    if (error.message && error.message.includes('timeout')) {
      message = getLocale('请求超时，请稍后再试')
    } else if (error.message && error.message.includes('Network Error')) {
      message = getLocale('网络连接异常，请检查网络设置')
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
    // base64 -> utf-8
    return JSON.parse(decode(s))
  } catch (error) {
    console.warn(error.message)
    return null
  }
}

function parseResponseHeaders(response: AxiosResponse) {
  const responseHeaders = response.headers

  const result = (responseHeaders['grpc-message'] || '').split('|')
  const gRPCMessageDetail: string = atob(result.slice(1).join('|'))
  const gRPCMessage: string = result[0] || ''
  const gRPCStatus: number = +responseHeaders['grpc-status']
  const isNaN = _.isNaN(gRPCStatus)

  return {
    gRPCMessageDetail,
    gRPCMessage,
    gRPCStatus: isNaN ? -1 : gRPCStatus,
  }
}

function formatToResponse<T>(response: AxiosResponse<T>) {
  const { gRPCMessageDetail, gRPCMessage, gRPCStatus } = parseResponseHeaders(
    response,
  )
  const data = response.data

  return {
    code: +gRPCStatus,
    message: {
      description: gRPCMessage,
      detail: gRPCMessageDetail,
    },
    response: data,
  }
}

function tailRequestTrim(
  obj: { [key: string]: any },
  result: { [key: string]: any },
) {
  _.forEach(Object.entries(obj), ([n, v]) => {
    if (v instanceof Object && !_.isArray(v)) {
      result[n] = {}
      tailRequestTrim(v, result[n])
    } else {
      result[n] = typeof v === 'string' ? v.trim() : v
    }
  })

  return result
}

function requestTrim(obj: { [key: string]: any }) {
  // 判断一下循环引用，如果有就抛错误
  JSON.stringify(obj)

  return tailRequestTrim(obj, {})
}

/**
 * 格式化错误信息
 *
 * 异常编码不存在或<2000:
 * <异常编码> <异常详细信息或异常编码翻译> rid: <请求ID> 日期: <请求时间>
 *
 * 异常编码>=2000:
 * <异常编码> <异常详细信息或异常编码翻译>
 */
function formatErrorMessage(
  message: string,
  statusCodeMap: Record<string, string>,
  response?: AxiosResponse,
  req?: AxiosRequestConfig,
): string {
  if (message === '网络连接异常，请检查网络设置') {
    return message
  }
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const result = (response.headers['grpc-message'] || '').split('|')
  const gRPCMessageDetail: string = atob(result.slice(1).join('|'))

  const code = response?.data?.code || 0
  let customizeReason = response?.data.message.detail?.reason
  const codeMessage = statusCodeMap[code]
  const rid =
    response?.config?.headers?.['X-Request-Id'] ||
    req?.headers?.['X-Request-Id']
  const timestamp =
    response?.config?.headers?.['X-Timestamp'] ||
    req?.headers?.['X-Timestamp'] ||
    new Date().valueOf()
  const formatedDate = formatDate(Number(timestamp))

  const isGrpcStatusCode = code < 2000

  if (!customizeReason) {
    customizeReason =
      gRPCMessageDetail || codeMessage || message || getLocale('服务异常')
  }

  let reason = `${code} ${customizeReason}`

  // 服务异常没有 rid
  if (isGrpcStatusCode) {
    if (rid) {
      reason += ` rid: ${rid}`
    }
    reason += ` 日期: ${formatedDate}`
  }

  return reason
}

export {
  formatToResponse,
  accessTokenKey,
  authInfoKey,
  requestUrl,
  requestEnvUrl,
  platform,
  isProduction,
  getErrorMessage,
  atob,
  requestTrim,
  formatErrorMessage,
}

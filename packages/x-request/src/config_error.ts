import { getLocale } from '@gm-common/locales'
import _ from 'lodash'
import {
  parseResponse,
  getErrorMessage,
  platform,
  requestUrl,
  isProduction,
  gRpcMsgKey,
  formatResponse,
} from './util'
import { AxiosResponse } from 'axios'
import { Storage } from '@gm-common/tool'
import { report } from '@gm-common/analyse'
import { instance } from './request'

function wrap(
  response: AxiosResponse,
  msg = getLocale('未知错误'),
): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    const { headers } = response.config
    const { gRPCStatus: code } = parseResponse(response)
    const sucCode = headers['X-Success-Code'].split(',')
    const gRpcMsgMap = Storage.get(gRpcMsgKey) || {}
    let message = msg
    if (_.isNaN(code) || !sucCode.includes(code + '')) {
      if (code) {
        message = gRpcMsgMap[code] || `${getLocale('未知错误')}: ${code}`
      }
      throw new Error(message)
    }
    resolve(response)
  })
}

function wrapErrorResponse(response: AxiosResponse) {
  const json = formatResponse(response)
  return {
    ...response,
    data: json,
  }
}

function configError(errorCallback: (msg: string, res?: any) => void): void {
  instance.interceptors.response.use(
    async (response) => {
      try {
        await wrap(response)
      } catch (error) {
        errorCallback(error.message, wrapErrorResponse(response))
        return Promise.reject(error)
      }
      return response
    },
    async (error) => {
      // 上报前端连接超时的具体网络时间信息
      if (isProduction && error.message && error.message.includes('timeout')) {
        const { url, headers, params } = error.config
        // 当前被超时终止的请求信息
        const data = {
          url,
          headers,
          params: JSON.stringify(params),
        }
        report(requestUrl + platform, data)
      }
      const message = getErrorMessage(error)

      if (error.response) {
        try {
          await wrap(error.response, message)
        } catch (e) {
          errorCallback(e.message, wrapErrorResponse(error.response))
          return Promise.reject(error)
        }
        return error.response
      } else {
        errorCallback(message)
        return Promise.reject(error)
      }
    },
  )
}

export default configError

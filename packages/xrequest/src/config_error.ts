import { getLocale } from '@gm-common/locales'
import _ from 'lodash'
import {
  getErrorMessage,
  platform,
  requestUrl,
  isProduction,
  gRpcMsgKey,
  atob,
} from './util'
import { AxiosResponse } from 'axios'
import { Storage } from '@gm-common/tool'
import { report } from '@gm-common/analyse'
import { instance } from './request'

function parseResponse(response: AxiosResponse) {
  const responseHeaders = response.headers
  const gRPCMessage = atob(responseHeaders['grpc-message'])
  const gRPCStatus = responseHeaders['grpc-status']
  const json = response.data || null
  response.data = {
    gRPCStatus,
    gRPCMessage,
    ...json,
  }
  return response
}

function wrap(response: AxiosResponse, msg = ''): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    const { headers } = response.config
    const { gRPCStatus } = response.data
    const sucCode = headers['X-Gm-Success-Code'].split(',')
    const gRpcMsgMap = Storage.get(gRpcMsgKey) || {}
    let message = msg
    if (!gRPCStatus || !sucCode.includes(gRPCStatus + '')) {
      if (gRPCStatus) {
        message =
          gRpcMsgMap[gRPCStatus] || `${getLocale('未知错误')}: ${gRPCStatus}`
      }
      throw new Error(message)
    }
    resolve(response)
  })
}

function configError(errorCallback: (msg: string, res?: any) => void): void {
  instance.interceptors.response.use(
    async (response) => {
      const res = parseResponse(response)
      try {
        await wrap(res)
      } catch (error) {
        errorCallback(error.message, res)
        return Promise.reject(error)
      }
      return res
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
        const res = parseResponse(error.response)
        try {
          await wrap(res, message)
        } catch (e) {
          errorCallback(e.message, res)
          return Promise.reject(error)
        }
        return res
      } else {
        errorCallback(message)
        return Promise.reject(error)
      }
    },
  )
}

export default configError

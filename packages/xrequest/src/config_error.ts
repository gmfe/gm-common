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
import { Storage } from '@gm-common/tool'
import { report } from '@gm-common/analyse'
import { instance } from './request'

function configError(errorCallback: (msg: string, res?: any) => void): void {
  instance.interceptors.response.use(
    (response) => {
      const requestHeaders = response.config.headers
      const responseHeaders = response.headers
      const gRPCStatus = responseHeaders['grpc-status']
      const sucCode = requestHeaders['X-Gm-Success-Code'].split(',')
      const gRpcMsgMap = Storage.get(gRpcMsgKey) || {}

      if (!sucCode.includes(gRPCStatus + '')) {
        const msg =
          gRpcMsgMap[gRPCStatus] || `${getLocale('未知错误')}: ${gRPCStatus}`
        errorCallback(msg, response)
        return Promise.reject(new Error(msg))
      }

      return response
    },
    (error) => {
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
      if (error.response) {
        const responseHeaders = error.response.headers
        const requestHeaders = error.request.headers
        const gRPCMessage = atob(responseHeaders['grpc-message'])
        const gRPCStatus = responseHeaders['grpc-status']
        const gRpcMsgMap = Storage.get(gRpcMsgKey) || {}
        const sucCode = requestHeaders['X-Gm-Success-Code'].split(',')
        if (!sucCode.includes(gRPCStatus + '')) {
          const msg =
            gRpcMsgMap[gRPCStatus] || `${getLocale('未知错误')}: ${gRPCStatus}`
          errorCallback(msg, error.response)
          return Promise.reject(error)
        }
        return {
          ...error.response,
          data: {
            gRPCStatus,
            gRPCMessage,
          },
        }
      } else {
        errorCallback(getErrorMessage(error))
        return Promise.reject(error)
      }
    },
  )
}

export default configError

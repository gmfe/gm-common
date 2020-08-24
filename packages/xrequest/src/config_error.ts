import { instance } from './request'
import { getLocale } from '@gm-common/locales'
import {
  getErrorMessage,
  platform,
  requestUrl,
  isProduction,
  gRpcMsgKey,
} from './util'
import { Storage } from '@gm-common/tool'
import { report } from '@gm-common/analyse'

function configError(errorCallback: (msg: string, res?: any) => void): void {
  instance.interceptors.response.use(
    (response) => {
      const { headers } = response.config
      const gRPCStatus = headers['grpc-status']
      const sucCode = headers['X-Gm-Success-Code'].split(',')
      const gRpcMsgMap = Storage.get(gRpcMsgKey) || {}

      if (!sucCode.includes(gRPCStatus + '')) {
        const msg =
          gRpcMsgMap[gRPCStatus] || `${getLocale('未知错误')}: ${gRPCStatus}`
        errorCallback(msg, response)
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
      errorCallback(getErrorMessage(error))
      return Promise.reject(error)
    },
  )
}

export default configError

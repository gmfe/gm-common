import { instance } from './request'
import { getLocale } from '@gm-common/locales'
import {
  getPerformanceInfo,
  getErrorMessage,
  platform,
  requestUrl,
  isProduction,
} from './util'
import { report } from '@gm-common/analyse'

function configError(errorCallback: (msg: string, res?: any) => void): void {
  instance.interceptors.response.use(
    (response) => {
      const sucCode = response.config.headers['X-Guanmai-Success-Code'].split(
        ',',
      )
      const json = response.data

      if (!sucCode.includes(json.code + '')) {
        const msg = json.msg || getLocale('未知错误')
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
          performance: JSON.stringify(getPerformanceInfo()),
        }
        report(requestUrl + platform, data)
      }
      errorCallback(getErrorMessage(error))
      return Promise.reject(error)
    },
  )
}

export default configError

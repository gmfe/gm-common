import { instance } from './request'
import { getLocale } from '@gm-common/locales'
import { getErrorMessage } from './util'

function configError(errorCallback) {
  instance.interceptors.response.use(
    response => {
      const sucCode = response.config.headers['X-Guanmai-Success-Code'].split(
        ','
      )
      const json = response.data

      if (!sucCode.includes(json.code + '')) {
        const msg = json.msg || getLocale('未知错误')
        errorCallback(msg)
      }

      return response
    },
    error => {
      errorCallback(getErrorMessage(error))
      return Promise.reject(error)
    }
  )
}

export default configError

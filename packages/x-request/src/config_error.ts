import { config } from './../../../node_modules/rxjs/src/internal/config'
import { getLocale } from '@gm-common/locales'
import _ from 'lodash'
import {
  getErrorMessage,
  platform,
  requestUrl,
  isProduction,
  formatToResponse,
} from './util'
import axios, { AxiosResponse } from 'axios'
import { report } from '@gm-common/analyse'
import { instance } from './request'
import { ErrorCallback } from './types'

function wrapErrorCallBack(err: any, fn) {
  return function (arg1, arg2) {
    return fn(arg1, arg2, err?.config)
  }
}

function wrap(
  response: AxiosResponse,
  errorCallback: ErrorCallback,
  msg?: string,
): AxiosResponse {
  const { headers } = response.config
  const wrapRes = wrapErrorResponse(response)
  const {
    data: { code },
  } = wrapRes
  const sucCode = headers['X-Success-Code'].split(',')

  let message = msg || getLocale('未知错误')

  // 如果错误了
  if (_.isNaN(code) || !sucCode.includes(code + '')) {
    if (code) {
      message = `${getLocale('未知错误')}`
    }

    errorCallback(message, wrapRes)

    throw new Error(message)
  }

  return response
}

function wrapErrorResponse(response: AxiosResponse) {
  const json = formatToResponse(response)

  return {
    ...response,
    data: json,
  }
}

function configError(errorCallback: ErrorCallback): void {
  instance.interceptors.response.use(
    (response) => {
      try {
        wrap(response, wrapErrorCallBack({}, errorCallback))
      } catch (error) {
        // 要转错误
        return Promise.reject(error)
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
      const message = getErrorMessage(error)

      if (error.response) {
        try {
          wrap(error.response, wrapErrorCallBack(error, errorCallback), message)
        } catch (error) {
          return Promise.reject(error)
        }

        // 要转成功
        return error.response
      } else {
        // 如果是取消请求抛出的error，则不调用errorCallback
        const isCancelError = axios.isCancel(error)
        if (!isCancelError) errorCallback(message, error.response, error.config)
        return Promise.reject(error)
      }
    },
  )
}

export default configError

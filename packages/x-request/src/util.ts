import _ from 'lodash'
import { getLocale } from '@gm-common/locales'

const platform = __NAME__ // eslint-disable-line

const isProduction = __PRODUCTION__ // eslint-disable-line

const requestUrl = '//trace.guanmai.cn/api/logs/request/'
const requestEnvUrl = '//trace.guanmai.cn/api/logs/environment/'
const gRpcMsgKey = 'GRPC_MSG_MAP'
const accessTokenKey = 'ACCESS_TOEKN_KEY'
const authInfoKey = 'AUTH_INTERFACE_KEY'

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
    return JSON.parse(window.atob(s))
  } catch (error) {
    console.warn(error.message)
    return null
  }
}

export {
  gRpcMsgKey,
  accessTokenKey,
  authInfoKey,
  requestUrl,
  requestEnvUrl,
  platform,
  isProduction,
  getErrorMessage,
  atob,
}

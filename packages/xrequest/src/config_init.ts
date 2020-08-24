import { Storage } from '@gm-common/tool'
import _ from 'lodash'
import { instance } from './request'
import {
  gRpcMsgKey,
  authInterfaceKey,
  accessTokenKey,
  hasFileData,
  processPostData,
} from './util'

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

export function configGrpcCodes(m: { [code: string]: string }) {
  Storage.set(gRpcMsgKey, m)
}

export function configAuth(url: string, field: string) {
  Storage.set(authInterfaceKey, {
    url,
    field,
  })
}

export default function configInit() {
  // 处理下数据
  instance.interceptors.request.use((config) => {
    if (config.method === 'post') {
      if (hasFileData(config.data)) {
        config.headers['Content-Type'] = 'multipart/form-data'
      }

      config.data = processPostData(config.data)
    }

    return config
  })

  instance.interceptors.response.use((response) => {
    const json = response.data
    const { headers, url } = response.config
    const gRPCStatus = headers['grpc-status']
    const gRPCMessage = atob(headers['grpc-message'])
    const authInterface = Storage.get(authInterfaceKey)
    if (authInterface?.url === url && authInterface?.field) {
      const accessToken = _.get(json, authInterface.field)
      if (accessToken) Storage.set(accessTokenKey, accessToken)
    }

    return {
      ...response,
      data: {
        gRPCStatus,
        gRPCMessage,
        ...json,
      },
    }
  })
}

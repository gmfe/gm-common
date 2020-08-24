import { Storage } from '@gm-common/tool'
import _ from 'lodash'
import { instance } from './request'
import {
  gRpcMsgKey,
  authInterfaceKey,
  accessTokenKey,
  hasFileData,
  processPostData,
  atob,
} from './util'

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
    const { url } = response.config
    const responseHeaders = response.headers
    const gRPCMessage = atob(responseHeaders['grpc-message'])
    const gRPCStatus = responseHeaders['grpc-status']

    const authInterface = Storage.get(authInterfaceKey)
    if (authInterface?.url === url && authInterface?.field) {
      const accessToken = _.get(json, authInterface.field)
      if (accessToken && typeof accessToken === 'string')
        Storage.set(accessTokenKey, accessToken)
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

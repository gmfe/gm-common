import { Storage } from '@gm-common/tool'
import _ from 'lodash'
import { instance } from './request'
import { gRpcMsgKey, authInfoKey, accessTokenKey } from './util'

export function configGrpcCodes(m: { [code: string]: string }) {
  Storage.set(gRpcMsgKey, m)
}

export function configAuth(url: string, field: string) {
  Storage.set(authInfoKey, { url, field })
  instance.interceptors.response.use((response) => {
    const json = response.data
    const { url } = response.config

    const authInfo = Storage.get(authInfoKey)
    if (authInfo?.url === url && authInfo?.field) {
      const accessToken = _.get(json, authInfo.field)
      if (accessToken && typeof accessToken === 'string')
        Storage.set(accessTokenKey, accessToken)
    }

    return response
  })
}

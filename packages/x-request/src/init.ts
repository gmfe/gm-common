import { Storage } from '@gm-common/tool'
import _ from 'lodash'
import { instance } from './request'
import { authInfoKey, accessTokenKey } from './util'

let accessToken: string | undefined
let authInfo: { url: string; field: string } | undefined

export function initAuth(url: string, field: string) {
  authInfo = { url, field }
  Storage.set(authInfoKey, authInfo)

  instance.interceptors.request.use((config) => {
    if (!accessToken) {
      accessToken = Storage.get(accessTokenKey)
    }
    if (accessToken) {
      config.headers.authorization = accessToken
    }

    return config
  })

  instance.interceptors.response.use((response) => {
    const json = response.data
    const { url } = response.config

    if (authInfo?.url === url && authInfo?.field) {
      const accessToken = _.get(json, authInfo.field)
      if (accessToken && typeof accessToken === 'string')
        Storage.set(accessTokenKey, accessToken)
    }

    return response
  })
}

export function clearAuth() {
  Storage.remove(accessTokenKey)
  accessToken = undefined
}

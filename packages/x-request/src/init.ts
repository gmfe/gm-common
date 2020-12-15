import axios from 'axios'
import { Storage } from '@gm-common/tool'
import _ from 'lodash'
import { authInfoKey, accessTokenKey } from './util'

let accessToken: string | undefined

let instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Timeout': '30000',
    'X-Success-Code': '0',
  },
})

function init(obj) {
  instance = obj
}

function initAuth(url: string, field: string) {
  Storage.set(authInfoKey, { url, field })
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

    const authInfo = Storage.get(authInfoKey)
    if (authInfo?.url === url && authInfo?.field) {
      const accessToken = _.get(json, authInfo.field)
      if (accessToken && typeof accessToken === 'string')
        Storage.set(accessTokenKey, accessToken)
    }

    return response
  })
}

function clearAuth() {
  Storage.remove(accessTokenKey)
  accessToken = undefined
}

export { clearAuth, init, initAuth, instance }

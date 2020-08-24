import { UUID, Storage } from '@gm-common/tool'
import { getFingerPrint, getCacheFingerPrint } from '@gm-common/fingerprint'
import { instance } from './request'
import { accessTokenKey } from './util'

function configHeaders(): void {
  // 没有没能立马获得指纹，则用 UUID 代替。
  // 一般第一次才可能没有获得指纹，后续都会被cache
  let clientId = getCacheFingerPrint() || UUID.generate()

  const clientName = __CLIENT_NAME__ // eslint-disable-line
  const version = __VERSION__ // eslint-disable-line

  // 没有的时候在异步获取，获取到就设置
  if (!getCacheFingerPrint()) {
    getFingerPrint().then((id) => {
      clientId = id

      instance.defaults.headers.common[
        'X-Gm-Client'
      ] = `${clientName}/${version} ${clientId}`
      return null
    })
  } else {
    instance.defaults.headers.common[
      'X-Gm-Client'
    ] = `${clientName}/${version} ${clientId}`
  }

  instance.interceptors.request.use((config) => {
    const accessToken = Storage.get(accessTokenKey)
    if (accessToken) config.headers.authorization = accessToken
    config.headers['X-Gm-Request-Id'] = UUID.generate()

    return config
  })
}

export default configHeaders

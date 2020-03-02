import { UUID } from '@gm-common/tool'
import { getFingerPrint, getCacheFingerPrint } from '@gm-common/fingerprint'
import { instance } from './request'

function configHeaders() {
  // 没有没能立马获得指纹，则用 UUID 代替。
  // 一般第一次才可能没有获得指纹，后续都会被cache
  let clientId = getCacheFingerPrint() || UUID.generate()

  const name = __NAME__ || 'none' // eslint-disable-line
  const version = __VERSION__ || 'none' // eslint-disable-line

  // 没有的时候在异步获取
  if (!getCacheFingerPrint()) {
    getFingerPrint().then(id => {
      clientId = id

      instance.defaults.headers.common[
        'X-Guanmai-Client'
      ] = `${name}/${version} ${clientId}`
    })
  }

  instance.interceptors.request.use(config => {
    config.headers['X-Guanmai-Request-Id'] = UUID.generate()
  })
}

export default configHeaders

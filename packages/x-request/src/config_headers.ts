import { UUID } from '@gm-common/tool'
import { getFingerPrint, getCacheFingerPrint } from '@gm-common/fingerprint'
import { instance } from './request'

function configHeaders(pathname?:string): void {
  // 没有没能立马获得指纹，则用 UUID 代替。
  // 一般第一次才可能没有获得指纹，后续都会被cache
  let clientId = getCacheFingerPrint() || UUID.generate()

  const clientName = __CLIENT_NAME__ // eslint-disable-line
  const version = __VERSION__ // eslint-disable-line
  const groupId =
  document.cookie.split(';').reduce((all, next) => {
    const data = next.split('=')
    all[data[0].trim()] = data[1]
    return all
  }, {} as Record<string, string>)?.[
    `gm_${pathname || location.pathname.split('/')[1]}_group_id`
  ] || 0

  // 没有的时候在异步获取，获取到就设置
  if (!getCacheFingerPrint()) {
    getFingerPrint().then((id) => {
      clientId = id

      instance.defaults.headers.common[
        'X-Client'
      ] = `${clientName}/${version} ${clientId}`
      return null
    })
  } else {
    instance.defaults.headers.common[
      'X-Client'
    ] = `${clientName}/${version} ${clientId}`
  }

  instance.interceptors.request.use((config) => {
     config.headers = {
      ...config.headers,
      'X-Request-Id': UUID.generate(),
      'X-Group-Id': groupId,
    }

    return config
  })
}

export default configHeaders

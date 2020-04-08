import Fingerprint2 from 'fingerprintjs2'
import { Storage } from '@gm-common/tool'

const KEY = '_CLIENT_ID'

// 做cache，不用每次都拿
let _cache = Storage.get(KEY) || ''

function getFingerPrint(): string | Promise<string> {
  if (_cache) {
    return _cache as string
  }

  return new Promise(resolve => {
    const handleCallback = () => {
      Fingerprint2.get(components => {
        const values = components.map(v => v.value)

        _cache = Fingerprint2.x64hash128(values.join(''), 31)

        Storage.set(KEY, _cache)

        resolve(_cache as string)
      })
    }

    if (window.requestIdleCallback) {
      window.requestIdleCallback(handleCallback)
    } else {
      setTimeout(handleCallback, 500)
    }
  })
}

function getCacheFingerPrint(): string {
  return _cache as string
}

export { getFingerPrint, getCacheFingerPrint }

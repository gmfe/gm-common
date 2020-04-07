import Fingerprint2 from 'fingerprintjs2'
import { Storage } from '@gm-common/tool'

const KEY = '_CLIENT_ID'

// 做cache，不用每次都拿
let _cache: string = (Storage.get(KEY) as string) || ''

function getFingerPrint(): Promise<string> {
  return new Promise((resolve) => {
    if (_cache) {
      resolve(_cache)
    } else {
      const handleCallback = () => {
        Fingerprint2.get((components) => {
          const values = components.map((v) => v.value)

          _cache = Fingerprint2.x64hash128(values.join(''), 31)

          Storage.set(KEY, _cache)

          resolve(_cache)
        })
      }

      if (window.requestIdleCallback) {
        window.requestIdleCallback(handleCallback)
      } else {
        setTimeout(handleCallback, 500)
      }
    }
  })
}

function getCacheFingerPrint(): string {
  return _cache
}

export { getFingerPrint, getCacheFingerPrint }

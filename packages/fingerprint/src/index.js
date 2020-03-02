import Fingerprint2 from 'fingerprintjs2'
import { Storage } from '@gm-common/tool'

const KEY = '_CLIENT_ID'

// 做cache，不用每次都拿
let _cache = Storage.get(KEY) || ''

function getFingerPrint() {
  if (_cache) {
    return _cache
  }

  return new Promise(resolve => {
    const handleCallback = () => {
      Fingerprint2.get(components => {
        const values = components.map(v => v.value)

        _cache = Fingerprint2.x64hash128(values.join(''), 31)

        Storage.set(KEY, _cache)

        resolve(_cache)
      })
    }

    // eslint-disable-next-line
    if (window.requestIdleCallback) {
      // eslint-disable-next-line
      requestIdleCallback(handleCallback)
    } else {
      setTimeout(handleCallback, 500)
    }
  })
}

function getCacheFingerPrint() {
  return _cache
}

export { getFingerPrint, getCacheFingerPrint }

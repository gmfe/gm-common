import { instance } from './request'
import { getCacheFingerPrint } from '@gm-common/fingerprint'

// eslint-disable-next-line
const isProduction = __PRODUCTION__

const enterTime = new Date() + ''

// eslint-disable-next-line
let platform = __NAME__

const requestUrl = '//trace.guanmai.cn/api/logs/request/'
const requestEnvUrl = '//trace.guanmai.cn/api/logs/environment/'

/* eslint-disable */
function getMetaData() {
  return {
    branch: __BRANCH__,
    commit: __COMMIT__,
    group_id:
      window.g_group_id ||
      window.g_partner_id ||
      (window.g_user && window.g_user.group_id),
    station_id: window.g_user && window.g_user.station_id,
    cms_key: window.g_cms_config && window.g_cms_config.key,
    name:
      (window.g_user &&
        (window.g_user.name ||
          window.g_user.username ||
          window.g_user.user_name)) ||
      null,
    enterTime,
    clientId: getCacheFingerPrint(),
    origin: window.location.href,
    userAgent: window.navigator.userAgent
  }
}
/* eslint-enable */

function doFetch(url, data) {
  window.fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

function feed(url, data = {}) {
  data.metaData = Object.assign({}, data.metaData, getMetaData())

  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      doFetch(url, data)
    })
  } else {
    setTimeout(() => {
      doFetch(url, data)
    }, 10)
  }
}

function doInterceptors(options = {}) {
  const timeMap = {}
  instance.interceptors.request.use(config => {
    const requestId = config.headers['X-Guanmai-Request-Id']
    timeMap[requestId] = Date.now()

    const { url, params, data } = config
    if (options.canRequest && options.canRequest(url)) {
      feed(requestUrl + platform, {
        url,
        params,
        data,
        requestId,
        reqTime: new Date() + ''
      })
    }

    return config
  })
  instance.interceptors.response.use(
    response => {
      const json = response.data
      const { url, headers, params, data } = response.config
      const requestId = headers['X-Guanmai-Request-Id']

      feed(requestUrl + platform, {
        url,
        params,
        data,
        requestId,
        resCode: json.code,
        resMsg: json.msg,
        resTime: new Date() + '',
        time: timeMap[requestId] ? Date.now() - timeMap[requestId] : ''
      })

      // 释放内存
      if (timeMap[requestId]) {
        delete timeMap[requestId]
      }

      return response
    },
    error => {
      // 就不上报了，意义不大
      return Promise.reject(error)
    }
  )
}

function configTrace(options) {
  if (!isProduction) {
    return
  }

  // 首次上报
  // 因为是一次上报，所以获取 getCacheFingerPrint 即可，有就有，没有就没有
  feed(requestEnvUrl + platform)

  // 添加中间件
  doInterceptors(options)
}

export default configTrace

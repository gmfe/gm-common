import axios, { AxiosRequestConfig } from 'axios'
import { parseUrl, stringifyUrl } from 'query-string'
import { getCacheFingerPrint } from '@gm-common/fingerprint'

function getUrlRandom(url: string): string {
  const obj = parseUrl(url)
  obj.query.v = '' + Math.random()

  return stringifyUrl(obj)
}

/* eslint-disable */
function getMetaData() {
  const enterTime = new Date() + ''
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
      window.g_user &&
      (window.g_user.name || window.g_user.username || window.g_user.user_name),
    enterTime,
    // 频繁获取 cookie 不知道是否有风险
    cookie: window.document.cookie,
    // 一般第一次才获取不到，不碍大事
    clientId: getCacheFingerPrint(),
    origin: window.location.href,
    userAgent: window.navigator.userAgent,
  }
}
/* eslint-enable */
// 约定 data requestId 字段，提供具设置 X-Guanmai-Request-Id，方便查看到 nginx 的时间
function doFetch(url: string, data: any, options?: AxiosRequestConfig): void {
  options = options || {}
  // 可能 JSON.stringify 报错，try catch 下
  try {
    axios({
      url: getUrlRandom(url),
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-Guanmai-Request-Id': `${data.requestId}`,
        ...options.headers,
      },
      ...options,
    })
  } catch (err) {
    console.warn(err)
  }
}

// 会带上上下文信息
function report(url: string, data: any, options?: AxiosRequestConfig): void {
  data.metaData = Object.assign({}, data.metaData, getMetaData())

  // 不卡主进程
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      doFetch(url, data, options)
    })
  } else {
    setTimeout(() => {
      doFetch(url, data, options)
    }, 10)
  }
}

export { report, getMetaData }

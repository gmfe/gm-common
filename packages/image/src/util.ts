import _ from 'lodash'
import type { Options } from './types'

function urlSafeBase64Encode(v: string): string {
  v = window.btoa(v)
  return v.replace(/\//g, '_').replace(/\+/g, '-')
}

function getOptionWithSafeBase64Encode(options: Options) {
  const opt: Options = { ...options }
  const encodes: string[] = ['image', 'text', 'font']
  _.each(encodes, (key: string) => {
    if (opt[key]) {
      opt[key] = urlSafeBase64Encode(opt[key])
    }
  })
  return opt
}

function getFunStr(url: string | null, fun: string, options: Options): string {
  let funStr = fun

  const { mode, ...rest } = options

  // mode 可能不存在，mode 可能为 0，用 undefined
  if (mode !== undefined) {
    funStr += `/${encodeURIComponent(mode)}`
  }

  for (const key in rest) {
    if (options[key] === true) {
      // 案例 auto-orient or
      funStr += `/${key}`
    } else {
      funStr += `/${key}/${encodeURIComponent(options[key])}`
    }
  }

  if (url !== null) {
    return `${url}?${funStr}`
  } else {
    return `${funStr}`
  }
}

export { getFunStr, getOptionWithSafeBase64Encode }

import _ from 'lodash'
/** 详见 https://cloud.tencent.com/document/product/460/6924 */
interface Options {
  [key: string]: any
}

interface Pipeline {
  fun: string
  options: Options
}

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

function getBaseImageUrl(url: string): string {
  return url.split('?')[0]
}

export function imageInfo(url: string): string {
  return `${getBaseImageUrl(url)}?imageInfo`
}

export function imageExif(url: string): string {
  return `${getBaseImageUrl(url)}?exif`
}

export function imageAve(url: string): string {
  return `${getBaseImageUrl(url)}?imageAve`
}

export function imageView2(url: string, options: Options): string {
  return getFunStr(getBaseImageUrl(url), 'imageView2', options)
}

export function imageMogr2(url: string, options: Options): string {
  return getFunStr(getBaseImageUrl(url), 'imageMogr2', options)
}

export function watermark(url: string, options: Options): string {
  const opt = getOptionWithSafeBase64Encode(options)
  return getFunStr(getBaseImageUrl(url), 'watermark', opt)
}

/** 可实现混合水印 */
export function pipeline(url: string, arr: Pipeline[]): string {
  const funStr = arr
    .map((item: Pipeline) => {
      const opt = getOptionWithSafeBase64Encode(item.options)
      return getFunStr(null, item.fun, opt)
    })
    .join('|')

  return `${getBaseImageUrl(url)}?${funStr}`
}

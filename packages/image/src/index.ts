import _ from 'lodash'
import { getOptionWithSafeBase64Encode, getFunStr } from './util'
import type { Options, Pipeline } from './types'
/** 详见 https://cloud.tencent.com/document/product/460/6924 */

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

export * from './upload'

import axios, { AxiosResponse } from 'axios'
import { Storage, UUID } from '@gm-common/tool'

interface QiniuInfo {
  prefix: string
  token: string
  expire_time: string
}

interface Opts {
  domain?: string
  fileType: string // 缓存用
  getQiniuInfo: () => Promise<QiniuInfo>
}

interface UploadData {
  hash: string
  key: string
}

const TOKEN_KEY_BASE = 'x_qiniu_token_'
const TOKEN_KEY_CACHE_TIME_BASE = 'x_qiniu_token_cache_time_'

function getUploadFileName(blob: File) {
  const { type } = blob
  const suf = type.split('/').pop()

  return `${UUID.generate()}.${suf}`
}

async function getCacheInfo(
  fetchInfo: () => Promise<QiniuInfo>,
  fileType: string,
) {
  const TOKEN_INFO_KEY = TOKEN_KEY_BASE + fileType
  const TOKEN_KEY_CACHE_TIME = TOKEN_KEY_CACHE_TIME_BASE + fileType
  let info = Storage.get(TOKEN_INFO_KEY)
  const _cache = Storage.get(TOKEN_KEY_CACHE_TIME)
  let _cacheTime: Date | undefined = _cache && new Date(_cache)
  if (info && _cacheTime && +new Date() - +_cacheTime < 5 * 60 * 1000) {
    return info
  }
  info = await fetchInfo()
  _cacheTime = new Date()

  Storage.set(TOKEN_INFO_KEY, info)
  Storage.set(TOKEN_KEY_CACHE_TIME, `${_cacheTime}`)

  return info
}

async function uploadRequest(url: string, data: { [key: string]: any }) {
  const formData = new window.FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }

  const res = await axios({
    method: 'post',
    url,
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  }).then((response: AxiosResponse<UploadData>) => response.data)

  return res
}

export async function qiniuUpload(blob: File, opts: Opts) {
  const options = {
    uploadUrl: 'https://upload-z2.qiniup.com/',
    domain: opts.domain || 'http://qhcvfb3qx.hn-bkt.clouddn.com',
    getQiniuInfo: opts.getQiniuInfo,
    fileType: opts.fileType,
  }

  if (!options.getQiniuInfo) {
    throw new Error('need getQiniuInfo')
  }

  const { prefix, token } = await getCacheInfo(
    options.getQiniuInfo,
    options.fileType,
  )

  const name = getUploadFileName(blob)
  const path = prefix ? `${prefix}${name}` : name

  const json = await uploadRequest(options.uploadUrl, {
    file: blob,
    token,
    key: path,
  })

  const url = `${options.domain}/${json.key}`

  return { url, key: json.key }
}

export type { QiniuInfo, Opts as Options }

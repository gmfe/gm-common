import axios from 'axios'
import { isArray, map, includes } from 'lodash'
import { getLocale } from '@gm-common/locales'
import { processPostData, hasFileData, getErrorMessage } from './util'
import { report } from '@gm-common/analyse'

const instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Guanmai-Timeout': '30000',
    'X-Guanmai-Success-Code': '0',
  },
})

// 处理下数据
instance.interceptors.request.use((config) => {
  if (config.method === 'post') {
    if (hasFileData(config.data)) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    config.data = processPostData(config.data)
  }

  return config
})

function httpReject(error: { [key: string]: any }): void {
  console.error(error)
  const url = 'https://trace.guanmai.cn/api/logs/more/' + __NAME__
  const entries = map(window.performance.getEntries(), (entry: any) => {
    if (includes(entry.name, 'bshop.guanmai.cn')) {
      return entry
    }
  }).filter((_) => _)

  report(url, {
    error: error,
    performanceTime: entries,
    title: 'http error',
  })

  const message = getErrorMessage(error)

  throw new Error(message)
}

function httpResolve(res: { [key: string]: any }, sucCode: number[]) {
  const json = res.data
  if (!sucCode.includes(json.code)) {
    throw new Error(json.msg || getLocale('未知错误'))
  }

  return json
}

interface RequestBaseConfigOptions {
  url: string
  headers: { [key: string]: any }
  [key: string]: any
}

interface RequestResult<Data> {
  code: number
  data: Data
  msg: string
  pagination?: { [key: string]: any }
}

class RequestBase<Data> {
  private _config: RequestBaseConfigOptions
  private _sucCode = [0]
  private _data = {}

  constructor(url: string, config?: object) {
    this._config = {
      url,
      headers: {},
      ...config,
    }
  }

  public code(code: number | number[]): RequestBase<Data> {
    let codes: number[] = code as number[]
    if (!isArray(code)) {
      codes = [(code as any) as number]
    }
    this._sucCode = this._sucCode.concat(codes)
    // 挂在 headers。暂时想不到其他方式传递出这个信息
    this._config.headers['X-Guanmai-Success-Code'] = this._sucCode.join(',')
    return this
  }

  public timeout(timeout: number): RequestBase<Data> {
    this._config.timeout = timeout
    this._config.headers['X-Guanmai-Timeout'] = `${timeout}`
    return this
  }

  public data(data: { [key: string]: any }): RequestBase<Data> {
    this._data = data
    return this
  }

  public json(data: { [key: string]: any }): RequestBase<Data> {
    this._data = JSON.stringify(data)
    return this
  }

  public get(): Promise<RequestResult<Data>> {
    this._config.params = this._data
    return instance
      .request(this._config)
      .then((res) => httpResolve(res, this._sucCode), httpReject)
  }

  public post(): Promise<RequestResult<Data>> {
    this._config.data = this._data
    this._config.method = 'post'
    return instance
      .request(this._config)
      .then((res) => httpResolve(res, this._sucCode), httpReject)
  }
}

function Request<Data>(url: string, config?: object): RequestBase<Data> {
  return new RequestBase(url, config)
}

export { instance, Request }

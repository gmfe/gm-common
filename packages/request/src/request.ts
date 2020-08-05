import axios, { CancelTokenSource } from 'axios'
import { isArray } from 'lodash'
import { getLocale } from '@gm-common/locales'
import { processPostData, hasFileData, getErrorMessage } from './util'

const CancelToken = axios.CancelToken
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
  public cancelSource: CancelTokenSource | null = null

  constructor(url: string, config?: RequestBaseConfigOptions) {
    if (config && config.abort) {
      this.cancelSource = CancelToken.source()
      config.cancelToken = this.cancelSource.token
      delete config.abort
    }
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
    return instance.request(this._config).then(
      (res) => {
        this._clearSource()
        return httpResolve(res, this._sucCode)
      },
      (err) => {
        this._clearSource()
        httpReject(err)
      },
    )
  }

  public abort(): void {
    return this.cancelSource?.cancel()
  }

  private _clearSource() {
    this.cancelSource = null
  }

  public post(): Promise<RequestResult<Data>> {
    this._config.data = this._data
    this._config.method = 'post'
    return instance.request(this._config).then(
      (res) => {
        this._clearSource()
        return httpResolve(res, this._sucCode)
      },
      (err) => {
        this._clearSource()
        httpReject(err)
      },
    )
  }
}

function Request<Data>(
  url: string,
  config?: RequestBaseConfigOptions,
): RequestBase<Data> {
  return new RequestBase(url, config)
}

export { instance, Request, CancelToken }

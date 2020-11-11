import axios, { AxiosRequestConfig } from 'axios'
import { formatResponse, requestTrim } from './util'

const instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Timeout': '30000',
    'X-Success-Code': '0',
  },
})

interface Response<T> {
  code: number
  message: {
    description: string
    detail: any
  }
  response: T
}

class RequestBase<Data> {
  private _config: AxiosRequestConfig
  private _sucCode = [0]
  private _data = {}

  constructor(url: string, config?: AxiosRequestConfig) {
    this._config = {
      url,
      headers: {},
      ...config,
    }
  }

  public code(codes: number[]): RequestBase<Data> {
    this._sucCode = this._sucCode.concat(codes)
    this._config.headers['X-Success-Code'] = this._sucCode.join(',')
    return this
  }

  public timeout(timeout: number): RequestBase<Data> {
    this._config.timeout = timeout
    this._config.headers['X-Timeout'] = `${timeout}`
    return this
  }

  public data(data: { [key: string]: any }): RequestBase<Data> {
    // requestTrim 剔除前后多余空格
    this._data = JSON.stringify(requestTrim(data))
    return this
  }

  public run(): Promise<Response<Data>> {
    this._config.data = this._data
    this._config.method = 'post'
    return instance.request<Data>(this._config).then((res) => {
      // formatResponse 不能再中间件做，中间件不更改数据
      return formatResponse<Data>(res)
    })
  }
}

function Request<Data>(url: string, config?: object) {
  return new RequestBase<Data>(url, config)
}

export { instance, Request }

export type { Response }

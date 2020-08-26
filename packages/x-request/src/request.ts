import axios, { AxiosRequestConfig } from 'axios'
const instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Gm-Timeout': '30000',
    'X-Gm-Success-Code': '0',
  },
})

interface Response<T> {
  code: number
  message: string
  detail: any
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
    this._config.headers['X-Gm-Success-Code'] = this._sucCode.join(',')
    return this
  }

  public timeout(timeout: number): RequestBase<Data> {
    this._config.timeout = timeout
    this._config.headers['X-Gm-Timeout'] = `${timeout}`
    return this
  }

  public data(data: { [key: string]: any }): RequestBase<Data> {
    this._data = JSON.stringify(data)
    return this
  }

  public run(): Promise<Response<Data>> {
    this._config.data = this._data
    this._config.method = 'post'
    return instance
      .request<Response<Data>>(this._config)
      .then((res) => res.data)
  }
}

function Request<Data>(url: string, config?: object) {
  return new RequestBase<Data>(url, config)
}

export { instance, Request }

export type { Response }

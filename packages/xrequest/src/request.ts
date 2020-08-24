import axios from 'axios'
import { isArray } from 'lodash'
import { getErrorMessage } from './util'
import configInit from './config_init'

const instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Gm-Timeout': '30000',
    'X-Gm-Success-Code': '0',
  },
})
configInit()

interface RequestBaseConfigOptions {
  url: string
  headers: { [key: string]: any }
  [key: string]: any
}

interface RequestResultBase {
  gRPCStatus: number
  gRPCMessage: string
}

class RequestBase<Data extends RequestResultBase> {
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
    this._config.headers['X-Gm-Success-Code'] = this._sucCode.join(',')
    return this
  }

  public timeout(timeout: number): RequestBase<Data> {
    this._config.timeout = timeout
    this._config.headers['X-Gm-Timeout'] = `${timeout}`
    return this
  }

  public data(data: { [key: string]: any }): RequestBase<Data> {
    this._data = data
    return this
  }

  public post(): Promise<void | Data> {
    this._config.data = this._data
    this._config.method = 'post'
    return instance.request<Data>(this._config).then(
      (res) => res.data,
      (error: { [key: string]: any }) => {
        console.error(error)
        const message = getErrorMessage(error)

        throw new Error(message)
      },
    )
  }
}

function Request<Data extends RequestResultBase>(url: string, config?: object) {
  return new RequestBase<Data>(url, config)
}

export { instance, Request }

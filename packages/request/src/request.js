import axios from 'axios'
import _ from 'lodash'
import { getLocale } from '@gm-common/locales'
import { processPostData, hasFileData } from './util'

const instance = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 处理下数据
instance.interceptors.request.use(config => {
  if (config.method === 'post') {
    console.log(hasFileData(config.data))
    if (hasFileData(config.data)) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    config.data = processPostData(config.data)
  }

  return config
})

function httpReject(error) {
  console.log(error.toJSON())

  if (error.response) {
    throw new Error(`${error.response.status} ${error.response.statusText}`)
  } else if (error.request) {
    throw new Error(getLocale('服务器错误'))
  } else {
    if (error.message && error.message.includes('timeout')) {
      throw new Error(getLocale('连接超时'))
    }

    throw new Error(error.message)
  }
}
function httpResolve(res, sucCode) {
  const json = res.data
  if (!sucCode.includes(json.code)) {
    console.log(res)
    throw new Error(json.msg || getLocale('未知错误'))
  }

  return json
}

function RequestBase(url, config) {
  this._data = {}
  this.sucCode = [0]
  this.config = {
    url,
    ...config
  }
}

RequestBase.prototype = {
  code: function(codes) {
    if (!_.isArray) {
      codes = [codes]
    }

    this.sucCode.push(codes)

    return this
  },
  timeout: function(timeout) {
    this.config.timeout = timeout

    return this
  },
  data: function(data) {
    this._data = data

    return this
  },
  json: function(data) {
    this._data = JSON.stringify(data)
    return this
  },
  get: function() {
    this.config.params = this._data

    return instance
      .request(this.config)
      .then(res => httpResolve(res, this.sucCode), httpReject)
  },
  post: function() {
    this.config.data = this._data
    this.config.method = 'post'
    return instance
      .request(this.config)
      .then(res => httpResolve(res, this.sucCode), httpReject)
  }
}

function Request(url, config) {
  return new RequestBase(url, config)
}

export { instance, Request }

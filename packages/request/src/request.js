import axios from 'axios'
import _ from 'lodash'

const instance = axios.create({
  timeout: 3000,
  headers: {
    Accept: 'application/json'
  }
})

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
    if (toString.call(this._data) !== '[object Object]') {
      // 过滤null  undefined 只Object 类型。
      this._data = _.pickBy({ ...data }, value => {
        return value !== null && value !== undefined
      })
    } else {
      this._data = data
    }

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
      .then(this._httpResolve, this._httpReject)
  },
  post: function() {
    this.config.data = this._data
    this.config.method = 'post'
    return instance
      .request(this.config)
      .then(this._httpResolve, this._httpReject)
  },
  _httpReject: function(error) {
    console.log(error.toJSON())

    if (error.response) {
      throw new Error(`${error.response.status} ${error.response.statusText}`)
    } else if (error.request) {
      throw new Error('no response')
    } else {
      throw new Error(error.message)
    }
  },
  _httpResolve: function(res) {
    const json = res.data
    if (!this.sucCode.includes(json.code)) {
      console.log(res)
      throw new Error(json.msg || 'Unknown Error')
    }

    return json
  }
}

function Request(url, config) {
  return new RequestBase(url, config)
}

export { instance, Request }

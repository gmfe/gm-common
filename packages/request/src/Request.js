import { getLocale } from '../locales'
import param from './param.js'
import format from './format.js'
import _ from 'lodash'
import RequestInterceptor from './RequestInterceptor'
import is from './is'

var setPromiseTimeout = function (promise, ms) {
  if (ms === false) {
    return promise
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(getLocale('连接超时'))
    }, ms)
    promise.then(resolve, reject)
  })
}

var processRequest = function (config) {
  return RequestInterceptor.interceptor.request(config)
}

var processResponse = function (promise, url, sucCode, config) {
  var color = 'color: #8a6d3b;'

  return setPromiseTimeout(promise, config.options.timeout).then(function (res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(format(`${getLocale('服务器错误')} {status} {statusText}`, res))
  }).then((json) => {
    return RequestInterceptor.interceptor.response(json, config)
  }, (reason) => {
    return Promise.reject(RequestInterceptor.interceptor.responseError(reason, config))
  }).then(function (json) {
    if (sucCode.indexOf(json.code) > -1) {
      return json
    } else {
      console.log('%c*** Request url: %s、code: %s、msg: %s', color, url, json.code, json.msg)
      return Promise.reject(json.msg || getLocale('未知错误'))
    }
  }).catch(function (reason) {
    // reason 有点复杂，各种实现，碰到一个解决一个吧
    if (is.promise(reason)) {
      return reason.catch(rea => {
        console.error('%c*** Request catch %s', color, rea)
        // reason 是个对象。目前先给字符串。吧。后续有需要在扩展

        /*
          reject 出一个字符串, 由于业务代码直接使用 reason, 而非 reason.message, 而 standard
          要求 reject 抛出一个 Error 对象, 由于涉及到的业务代码过多, 可以延后改, 下同
        */
        /* eslint-disable-next-line */
        return Promise.reject('' + rea)
      })
    } else {
      console.error('%c*** Request catch %s', color, reason)
      // reason 是个对象。目前先给字符串。吧。后续有需要在扩展
      /* eslint-disable-next-line */
      return Promise.reject('' + reason)
    }
  })
}

var Request = function (url, options) {
  this._data = {}
  this.url = url
  this.sucCode = [0]
  this.options = Object.assign({
    timeout: 30000, // number or false
    method: 'get',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include' // 需要设置才能获取cookie
  }, options)
}

var isFile = function (v) {
  return /\[object File\]|\[object Blob\]/.test(toString.call(v))
}

var isFiles = function (v) {
  return toString.call(v) === '[object Array]' && isFile(v[0])
}

Request.prototype = {
  code: function (codes) {
    if (_.isArray(codes)) {
      this.sucCode = this.sucCode.concat(codes)
    } else {
      this.sucCode.push(codes)
    }
    return this
  },
  timeout: function (timeout) {
    Object.assign(this.options, {
      timeout
    })
    return this
  },
  data: function (_data) {
    // 过滤null  undefined 只Object 类型。
    this._data = Object.assign({}, _data)
    if (toString.call(this._data) === '[object Object]') {
      this._data = _.pickBy(this._data, value => {
        return value !== null && value !== undefined
      })
    }
    return this
  },
  json: function (_data) {
    this._data = JSON.stringify(_data)
    return this
  },
  _getConfig: function () {
    var t = this
    return {
      url: t.url,
      data: t._data,
      sucCode: t.sucCode,
      options: t.options
    }
  },
  _setConfig: function (d) {
    var t = this
    t.url = d.url
    t._data = d.data
    t.sucCode = d.sucCode
    t.options = d.options
  },
  _beforeRequest: function () {
    var t = this
    return processRequest(t._getConfig()).then(t._setConfig.bind(t))
  },
  get: function () {
    var t = this

    return t._beforeRequest().then(function () {
      const reqData = Object.assign({}, t._data)

      _.forEach(reqData, (value, key) => {
        if (typeof value === 'string') {
          reqData[key] = _.trim(value)
        }
      })

      var p = param(reqData)

      var newUrl = t.url + (p ? ((t.url.indexOf('?') > -1 ? '&' : '?') + p) : '')
      return processResponse(window.fetch(newUrl, t.options), t.url, t.sucCode, t._getConfig())
    })
  },
  post: function () {
    var t = this
    var data = t._data
    var body
    t.options.method = 'post'

    return t._beforeRequest().then(function () {
      // 兼容传[json string] [formData] 的情况,暂时这两种. 其他的看情况
      if (toString.call(data) === '[object Object]') {
        // 如果存在Files，就用表单上传
        if (_.find(data, v => (isFile(v) || isFiles(v)))) {
          body = new window.FormData()
          for (var e in data) {
            if (isFiles(data[e])) {
              data[e].forEach(file => {
                body.append(e, file, file.name)
              })
            } else {
              body.append(e, data[e])
            }
          }
        } else {
          // 否则 x-www-form-urlencoded。  和jquery的post一样
          t.options.headers = Object.assign({}, t.options.headers, {
            'Content-Type': 'application/x-www-form-urlencoded'
          })
          body = param(data)
        }
      } else {
        body = data
      }
      t.options.body = body
      return processResponse(window.fetch(t.url, t.options), t.url, t.sucCode, t._getConfig())
    })
  }
}

var RequestFactory = function (url, options) {
  return new Request(url, options)
}

export default RequestFactory

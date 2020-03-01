import _ from 'lodash'

const weixin = () => /MicroMessenger/i.test(navigator.userAgent)

const alipay = () => /Alipay/i.test(navigator.userAgent)

const mac = () => window.navigator.userAgent.includes('Mac')

const promise = (arg) => window.toString.call(arg) === '[object Promise]'

// 废弃
const mobile = window.navigator.userAgent.includes('Mobile')

// 想不出其他名字了
const phone = () => window.navigator.userAgent.includes('Mobile')

const number = value => {
  value += ''

  if (value === '') {
    return false
  }

  if (value.includes('x')) {
    return false
  }

  return !_.isNaN(Number(value))
}

const integer = value => {
  value += ''

  if (_.isNumber(value)) {
    return parseInt(value) === +value
  }
  return false
}

const positive = value => {
  value += ''
  if (_.isNumber(value)) {
    return Math.abs(value) === +value && value > 0
  }
  return false
}

const negative = value => {
  value += ''
  if (_.isNumber(value)) {
    return Math.abs(value) === -value && value < 0
  }
  return false
}

const chinese = value => {
  return /[\u4E00-\u9FA5]/.test(value)
}

// 强密码要求: 字母和数字组合,8位及以上
const strongPassword = (value) => {
  if (typeof value !== 'string') {
    return false
  }
  return /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]{8,}$/i.test(value)
}

let isWeixinMP = null
let weixinMP = () => {
  if (isWeixinMP === null) {
    isWeixinMP = window.__wxjs_environment === 'miniprogram' || /miniprogram/.test(window.navigator.userAgent.toLowerCase())
  }
  return isWeixinMP
}

let isiOS = null
let iOS = () => {
  if (isiOS === null) {
    isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }
  return isiOS
}

const numberOrChar = value => {
  return /^(\d|[a-z]|[A-Z])+$/g.test(value)
}

const android = () => {
  return window.navigator.userAgent.includes('Android')
}

const is = {
  // 废弃
  isChinese: chinese,
  mobile,
  weixin,
  alipay,
  mac,
  phone,
  weixinMP,
  iOS,
  android,

  promise,

  numberOrChar,
  number,
  integer,
  positive,
  negative,

  chinese,

  strongPassword
}

export default is

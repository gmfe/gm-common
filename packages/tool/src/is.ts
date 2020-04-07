import _ from 'lodash'

const weixin = () => /MicroMessenger/i.test(navigator.userAgent)

const alipay = () => /Alipay/i.test(navigator.userAgent)

const mac = () => window.navigator.userAgent.includes('Mac')

const promise = (arg: any) => window.toString.call(arg) === '[object Promise]'

// 废弃
const mobile = window.navigator.userAgent.includes('Mobile')

// 想不出其他名字了
const phone = () => window.navigator.userAgent.includes('Mobile')

const number = (value: any): boolean => {
  value += ''

  if (value === '') {
    return false
  }

  if (value.includes('x')) {
    return false
  }
  return !_.isNaN(Number(value))
}

const integer = (value: any): boolean => {
  value += ''

  if (_.isNumber(value)) {
    return parseInt(value + '') === +value
  }
  return false
}

const positive = (value: any): boolean => {
  value += ''
  if (_.isNumber(value)) {
    return Math.abs(value) === +value && value > 0
  }
  return false
}

const negative = (value: any): boolean => {
  value += ''
  if (_.isNumber(value)) {
    return Math.abs(value) === -value && value < 0
  }
  return false
}

const chinese = (value: string): boolean => {
  return /[\u4E00-\u9FA5]/.test(value)
}

// 强密码要求: 字母和数字组合,8位及以上
const strongPassword = (value: string): boolean => {
  return /^(?![0-9]+$)(?![a-z]+$)[0-9a-z]{8,}$/i.test(value)
}

let isWeixinMP: boolean | null = null
const weixinMP = () => {
  if (isWeixinMP === null) {
    isWeixinMP =
      window.__wxjs_environment === 'miniprogram' ||
      /miniprogram/.test(window.navigator.userAgent.toLowerCase())
  }
  return isWeixinMP
}

let isiOS: boolean | null = null
const iOS = () => {
  if (isiOS === null) {
    isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }
  return isiOS
}

const numberOrChar = (value: string): boolean => {
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

  strongPassword,
}

export default is

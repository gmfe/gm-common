import _ from 'lodash'
import Big from 'big.js'

const defaultOptions = {
  precision: 2, // 保留小数点后几位
  keepZero: true, // 是否要保留尾部的0
  useGrouping: true, // 是否使用,分隔
}
// 格式化 value 为 '1,234,5.00' 这种形式
// value 必须可以转为 Number 类型 否则返回 ''
// 调用方可通过 Big.DP 设置位数 Big.RM 设置舍入方式
const formatNumber = (value: number | string, options: object): string => {
  if (_.isNil(value)) {
    return ''
  }
  const number = Number(value)
  if (_.isNaN(number)) {
    return ''
  }
  const mergedOptions = { ...defaultOptions, ...options }
  const { precision, keepZero, useGrouping } = mergedOptions

  const sign = number < 0 ? '-' : ''
  const roundNumber = Big(Math.abs(number)).round(precision)
  let strNumber = roundNumber.toString()
  // 保留末尾 0
  if (keepZero) {
    strNumber = roundNumber.toFixed(precision)
  }

  // 逗号分隔
  if (useGrouping) {
    strNumber = strNumber.replace(/^\d+/g, (m) =>
      m.replace(/(?=(?!^)(\d{3})+$)/g, ','),
    )
  }

  return sign + strNumber
}

export default formatNumber

import Big from 'big.js'
import formatNumber from './format_number'

function toThousandStr(price: number | string): string {
  return parseFloat(Big(price).div(100).toFixed(2)).toLocaleString()
}

function toThousandStrWithNum(num: number | string): string {
  return parseFloat(Big(num).toString()).toLocaleString()
}

export { toThousandStr, toThousandStrWithNum, formatNumber }

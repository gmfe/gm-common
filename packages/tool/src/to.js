import Big from 'big.js'

function toThousandStr (price) {
  return parseFloat(Big(price).div(100).toFixed(2), 10).toLocaleString()
}

function toThousandStrWithNum (num) {
  return parseFloat(Big(num), 10).toLocaleString()
}

export default {
  toThousandStr,
  toThousandStrWithNum
}

import Big from 'big.js'

function toThousandStr(price: number | string): string {
  return parseFloat(
    Big(price)
      .div(100)
      .toFixed(2)
  ).toLocaleString()
}

function toThousandStrWithNum(num: number | string): string {
  return parseFloat(Big(num).toString()).toLocaleString()
}

export { toThousandStr, toThousandStrWithNum }

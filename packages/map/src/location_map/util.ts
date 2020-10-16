import _ from 'lodash'

interface tipsArray {
  adcode: string
  address: string
  city: string[]
  district: string
  id: string
  location: string
  name: string
}

interface CenterResponse {
  info: string
  infocode: string
  status: string
  regeocode: { formatted_address: string }
}

interface TipResponse extends Omit<CenterResponse, 'regeocode'> {
  count: string
  tips: tipsArray[]
}

function fetchMapData(baseUrl: string, paramsUrl: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText))
          } catch (err) {
            reject(new Error('data error. JSON.parse.'))
          }
        } else {
          reject(new Error('amap service error'))
        }
      }
    }
    xhr.open('get', baseUrl + paramsUrl)
    xhr.send()
  })
}

async function getMapTips(baseUrl: string, paramsUrl: string) {
  const tipsData = (await fetchMapData(baseUrl, paramsUrl)) as TipResponse
  if (tipsData.status === '1') {
    // 过滤掉不合法的item
    const tipList = _.filter(
      tipsData.tips,
      (item) => typeof item.id === 'string',
    )
    return tipList
  }
  return []
}

async function getMapCenterAddress(
  baseUrl: string,
  paramsUrl: string,
): Promise<string> {
  const centerData = (await fetchMapData(baseUrl, paramsUrl)) as CenterResponse
  if (centerData.status === '1') {
    const keywords: string = centerData.regeocode.formatted_address
    return keywords
  }
  return ''
}
export type { tipsArray }
export { getMapTips, getMapCenterAddress }

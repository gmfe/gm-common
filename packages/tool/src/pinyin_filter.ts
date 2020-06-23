import pinyin from './pinyin'
import _ from 'lodash'

const cache: { [key: string]: { [key: string]: boolean } } = {}

// 字符串匹配，中文首字母拼音匹配，字母小写匹配
const pinYinFilter = (
  list: any[],
  filterText: string,
  what: (v: any) => string,
): any[] => {
  if (!filterText) {
    return list || []
  }

  what = what || ((v) => v)
  filterText = filterText.toLowerCase()

  return _.filter(list, (v) => {
    let text = what(v)
    if (!_.isString(text)) {
      return false
    }
    text = text.toLowerCase()

    // 优先 cache
    if (cache[filterText] && cache[filterText][text] !== undefined) {
      return cache[filterText][text]
    }

    cache[filterText] = cache[filterText] || {}

    // 优先纯文字文字匹配
    if (text.includes(filterText)) {
      cache[filterText][text] = true
      return true
    }

    // 全拼集合。
    // 把 text 拆细，便于 pinyin 更细粒度的 cache
    const normal = _.map(text, (t) => pinyin(t))
    // 首字母集合
    const firstLetter = _.map(normal, (n) => n[0])

    cache[filterText][text] =
      normal.join('').includes(filterText) ||
      firstLetter.join('').includes(filterText)

    return cache[filterText][text]
  })
}

export default pinYinFilter

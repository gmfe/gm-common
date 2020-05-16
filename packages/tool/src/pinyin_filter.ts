import pinyin from './pinyin'
import _ from 'lodash'

const cache: { [key: string]: boolean } = {}

// 字符串匹配，中文首字母拼音匹配，字母小写匹配
const pinYinFilter = (
  list: unknown[],
  filterText: string,
  what: (v: unknown) => string,
): unknown[] => {
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
    if (cache[text] !== undefined) {
      return cache[text]
    }

    // 优先纯文字文字匹配
    if (text.includes(filterText)) {
      cache[text] = true
      return true
    }

    // 全拼集合。
    // 把 text 拆细，便于 pinyin 更细粒度的 cache
    const normal = _.map(text, (t) => pinyin(t))
    // 首字母集合
    const firstLetter = _.map(normal, (n) => n[0])

    cache[text] =
      normal.includes(filterText) || firstLetter.includes(filterText)

    return cache[text]
  })
}

export default pinYinFilter

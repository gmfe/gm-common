import pinyin from './pinyin.js'
import _ from 'lodash'
import is from './is'

// 字符串匹配，中文首字母拼音匹配，字母小写匹配
const pinYinFilter = (list, filterText, what) => {
  if (!filterText) {
    return list || []
  }

  what = what || (v => v)
  filterText = filterText.toLowerCase()

  // 移动 android 不支持 localeCompare
  if (is.android()) {
    console.warn(
      '移动端 Android 存在不支持 pinYinFilter，直接采用字符串匹配，因 localeCompare 存在兼容性问题'
    )
    return _.filter(list, v => {
      let w = what(v)
      if (!_.isString(w)) {
        w = ''
      }
      return w.indexOf(filterText) > -1
    })
  }

  return _.filter(list, v => {
    let w = what(v)
    if (!_.isString(w)) {
      w = ''
    }
    w = w.toLowerCase()
    // 全拼集合
    const normal = _.map(pinyin(w), value => value[0]).join('')
    // 首字母集合
    const firstLetter = _.map(
      pinyin(w, 'first_letter'),
      value => value[0]
    ).join('')

    return (
      w.indexOf(filterText) > -1 ||
      normal.indexOf(filterText) > -1 ||
      firstLetter.indexOf(filterText) > -1
    )
  })
}

export default pinYinFilter

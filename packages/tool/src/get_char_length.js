import is from './is'
import _ from 'lodash'

export default function(text) {
  return _.sum(_.map(text, v => (is.isChinese(v) ? 2 : 1)))
}

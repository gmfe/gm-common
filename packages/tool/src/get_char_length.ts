import is from './is'
import { sum, map } from 'lodash'

export default function(text: string): number {
  return sum(map(text, v => (is.isChinese(v) ? 2 : 1)))
}

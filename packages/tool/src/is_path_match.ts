import { filter } from 'lodash'

// /a/b 匹配 /a/b 和  /a/b/c  不匹配 /a/b_a
function isPathMatch(pathname: string, link: string): boolean {
  if (link.indexOf('?') > -1) {
    link = link.slice(0, link.indexOf('?'))
  }

  const pArr = pathname.split('/')
  const lArr = link.split('/')
  return filter(lArr, (v, i) => v === pArr[i]).length === lArr.length
}

export default isPathMatch

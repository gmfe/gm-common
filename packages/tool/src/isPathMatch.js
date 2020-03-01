import _ from 'lodash'

// /a/b 匹配 /a/b 和  /a/b/c  不匹配 /a/b_a
function isPathMatch (pathname, link) {
  if (link.indexOf('?') > -1) {
    link = link.slice(0, link.indexOf('?'))
  }

  const pArr = pathname.split('/'); const lArr = link.split('/')
  return _.filter(lArr, (v, i) => pArr.indexOf(v) === i).length === lArr.length
}

export default isPathMatch

import _ from 'lodash'

export default function sortByWithIndex(list, cb) {
  let i = 0
  return _.sortBy(list, v => {
    return cb(v, i++)
  })
}

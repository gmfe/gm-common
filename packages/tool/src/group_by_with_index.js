import _ from 'lodash'

export default function group_by_with_index(list, cb) {
  let i = 0
  return _.groupBy(list, v => {
    return cb(v, i++)
  })
}

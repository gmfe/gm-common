import _ from 'lodash'

export default function groupByWithIndex (list, cb) {
  let i = 0
  return _.groupBy(list, v => {
    return cb(v, i++)
  })
}

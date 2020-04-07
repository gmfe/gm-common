import { sortBy } from 'lodash'

export default function sortByWithIndex(
  list: any[],
  cb: (v: string, index: number) => any
): any[] {
  let i = 0
  return sortBy(list, v => {
    return cb(v, i++)
  })
}

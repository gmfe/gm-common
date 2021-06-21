import React from 'react'
import pinYinFilter from '../packages/tool/src/pinyin_filter'

console.log(
  pinYinFilter(
    [
      { id: '1', name: '商户1', company: '公司1' },
      { id: '2', name: '商2', company: '公司2' },
      { id: '3', name: '户3', company: '公司3' },
    ],
    'hu',
    (v) => v.name,
  ),
)

export const demo = () => {
  return <div>demo</div>
}

export default {
  title: 'Demo',
}
// test

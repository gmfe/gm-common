import React from 'react'
import { report, reportToQy } from './'

export const Normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          report('https://trace.guanmai.cn/api/logs/more/upms', {
            hello: 'word',
          })
        }}
      >
        report
      </button>

      <button
        onClick={() => {
          reportToQy('upms', {
            hello: 'word',
          })
        }}
      >
        reportQy 一般用户点击触发
      </button>
    </div>
  )
}

export default {
  title: 'analyse|analyse',
}

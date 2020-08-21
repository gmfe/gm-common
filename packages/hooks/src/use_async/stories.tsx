import React, { useRef } from 'react'
import useAsync from './index'
import _ from 'lodash'

function fetchData(params: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve('resolve ' + params)
      }
      reject('reject')
    }, 2000)
  })
}

export const Normal = () => {
  const { data, loading, error, run, refresh } = useAsync(fetchData, {
    onSuccess: (data) => {
      console.log('onSuccess', data)
    },
    onError: (error) => console.log('onError', error),
  })

  console.log(data, loading, error)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run('run action')
        }}
      >
        run
      </button>
      <button
        onClick={() => {
          refresh()
        }}
      >
        refresh
      </button>
    </div>
  )
}

/**
 * 手动
 */
export const Manual = () => {
  const { data, loading, error, run } = useAsync(fetchData, {
    manual: true,
  })

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run('run action')
        }}
      >
        run
      </button>
    </div>
  )
}

/**
 * 内存级别的数据缓存，会优先返回缓存数据，之后会请求数据更新。使用此选项注意 data 和 loading 的配合，如果 data 有数据，loading true，UI 不显示 loading 态
 */
export const Cache = () => {
  const { data, loading, error, run } = useAsync(fetchData, {
    cacheKey: 'cacheKey',
  })

  console.log(data, loading, error)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run('run action')
        }}
      >
        run
      </button>
    </div>
  )
}

/**
 * 只响应最后一次 run
 */
export const Order = () => {
  const refCount = useRef(0)

  function fetchData() {
    return new Promise((resolve) => {
      const time = _.random(0, 10) * 200
      const count = refCount.current++

      setTimeout(() => {
        resolve(`${count} ${time}`)
      }, time)
    })
  }

  const { data, run } = useAsync(fetchData)

  console.log(data)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <button
        onClick={() => {
          run('run action')
        }}
      >
        run
      </button>
    </div>
  )
}

export default {
  title: 'Hooks/async/useAsync',
}

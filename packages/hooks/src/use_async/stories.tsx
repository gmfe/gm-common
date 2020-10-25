import React, { useRef } from 'react'
import useAsync from './use_async'
import _ from 'lodash'

interface Params {
  name?: string
  action?: string
}

type Data = string

function fetchData(params: Params): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve('resolve ' + JSON.stringify(params))
      }
      reject('reject')
    }, 2000)
  })
}

// 自动
export const NotManual = () => {
  const { data, params, loading, error, run, refresh } = useAsync<Params, Data>(
    fetchData,
    {
      defaultParams: {
        name: 'lala',
      },
      onSuccess: (data) => {
        console.log('onSuccess', data)
      },
      onError: (error) => console.log('onError', error),
      manual: false,
    },
  )

  console.log('render', params, data, loading, error)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run({ action: 'run action' })
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
 * 默认手动
 */
export const Manual = () => {
  const { data, loading, error, run } = useAsync<Params, Data>(fetchData)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run({ action: 'run action' })
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
  const { data, loading, error, run } = useAsync<Params, Data>(fetchData, {
    cacheKey: 'cacheKey',
    manual: false,
  })

  console.log(data, loading, error)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <div>loading {JSON.stringify(loading)}</div>
      <div>error {JSON.stringify(error)}</div>
      <button
        onClick={() => {
          run({ action: 'run action' })
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

  function fetchData(): Promise<Data> {
    return new Promise((resolve) => {
      const time = _.random(0, 10) * 200
      const count = refCount.current++

      setTimeout(() => {
        resolve(`${count} ${time}`)
      }, time)
    })
  }

  const { data, run } = useAsync<Params, Data>(fetchData, { manual: false })

  console.log(data)

  return (
    <div>
      <div>data {JSON.stringify(data)}</div>
      <button
        onClick={() => {
          run({ action: 'run action' })
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

import React from 'react'
import usePagination from './index'
import _ from 'lodash'

const count = 50
function fetchData(params: any) {
  const {
    paging: { limit, offset, need_count },
  } = params

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lists: _.range(offset, offset + limit),
        paging: {
          has_more: limit + offset < count,
          count: need_count && offset === 0 ? count : undefined,
        },
      })
    }, 1000)
  })
}

export const Normal = () => {
  const {
    data,
    loading,
    params,
    paging,
    refresh,
    runWithPaging,
  } = usePagination(fetchData, {
    defaultParams: {
      paging: {
        limit: 5,
        need_count: true,
      },
    },
  })

  return (
    <div>
      <pre>params: {JSON.stringify(params, null, 2)}</pre>
      <pre>loading: {JSON.stringify(loading, null, 2)}</pre>
      <pre>data: {JSON.stringify(data, null, 2)}</pre>
      <pre>paging: {JSON.stringify(paging, null, 2)}</pre>
      <div>
        <button
          onClick={() => {
            refresh()
          }}
        >
          refresh
        </button>
        <button
          onClick={() => {
            runWithPaging({
              offset: 20,
            })
          }}
        >
          runWithPaging offset 20
        </button>
        <button
          onClick={() => {
            runWithPaging({
              offset: 40,
            })
          }}
        >
          runWithPaging offset 40
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Hooks/async/usePagination',
}

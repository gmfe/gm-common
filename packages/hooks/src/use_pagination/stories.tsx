import React from 'react'
import usePagination from './use_pagination'
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
    run,
    refresh,
    runChangePaging,
  } = usePagination(fetchData, {
    defaultPaging: {
      limit: 5,
      need_count: true,
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
            run()
          }}
        >
          run
        </button>
        <button
          onClick={() => {
            run({
              paging: {
                offset: 20,
              },
            })
          }}
        >
          run offset 20
        </button>
        <button
          onClick={() => {
            refresh()
          }}
        >
          refresh
        </button>
        <button
          onClick={() => {
            runChangePaging({
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

import React, { useEffect } from 'react'
import usePagination from './use_pagination'
import _ from 'lodash'
import { Button, Pagination } from '@gm-pc/react'
import { observable } from 'mobx'
import { PagingReq, PagingRes } from '../types'

const count = 50

interface Params {
  [propName: string]: any
  paging: PagingReq
}

interface Data {
  lists?: any[]
  paging: PagingRes
}

function fetchData(params?: any): Promise<Data> {
  const {
    paging: { limit, offset, need_count },
  } = params!

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lists: _.range(offset, offset + limit),
        paging: {
          has_more: limit + offset < count,
          count: need_count && offset === 0 ? count : 0,
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
  } = usePagination<Params, Data>(fetchData, {
    defaultPaging: {
      need_count: true,
    },
    paginationKey: 'paginationKey',
  })

  console.log('render')

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
          runChangePaging offset 40
        </button>
        <button
          onClick={() => {
            runChangePaging({
              limit: 5,
            })
          }}
        >
          runChangePaging limit 5
        </button>
      </div>
    </div>
  )
}

const paginationHookStore = observable({
  defaultPagingWithCount: {
    need_count: true,
  },

  req: {
    q: '',
    paging: {},
  },

  getPaging(paging: any) {
    console.log(paging, 'ppppp')

    return { paging: { has_more: true, count: 100 } }
  },

  fetchData(params?: Params): Promise<Data> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(this.getPaging(params))
      }, 1000),
    )
  },
})

const WithCountHook = () => {
  const { req, defaultPagingWithCount } = paginationHookStore
  const { loading, runChangePaging, paging, run } = usePagination<Params, Data>(
    (params?) => paginationHookStore.fetchData(params),
    {
      defaultParams: { paging: { ...defaultPagingWithCount } },
    },
  )

  useEffect(() => {
    run({ ...req, paging: { ...defaultPagingWithCount } })
  }, [])

  const handleSearch = () => {
    const reqParam = { ...req, paging: { ...defaultPagingWithCount } }
    run(reqParam)
  }

  return (
    <div>
      <Button type='primary' loading={loading} onClick={handleSearch}>
        without count 搜索
      </Button>
      <Pagination paging={paging} onChange={runChangePaging} />
    </div>
  )
}

const WithoutCountHook = () => {
  const { req } = paginationHookStore
  const {
    loading: ncLoading,
    runChangePaging: ncRunChangePaging,
    paging: ncPaging,
    run: ncRun,
  } = usePagination<Params, Data>((params) =>
    paginationHookStore.fetchData(params as Params),
  )

  useEffect(() => {
    ncRun({ ...req })
  }, [])

  const handleNcSearch = () => {
    const reqParam = { ...req }
    ncRun(reqParam)
  }
  return (
    <div>
      <div>without count</div>
      <Button type='primary' loading={ncLoading} onClick={handleNcSearch}>
        with count 搜索
      </Button>
      <Pagination paging={ncPaging} onChange={ncRunChangePaging} />
    </div>
  )
}

export const PaginationHook = () => {
  return (
    <div>
      <WithCountHook />
      <WithoutCountHook />
    </div>
  )
}

export default {
  title: 'Hooks/async/usePagination',
}

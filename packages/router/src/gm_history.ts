import _ from 'lodash'
import { stringify } from 'query-string'
import { createHashHistory } from 'history'
import type { History } from 'history'

const history = createHashHistory()

interface ProcessHistoryOptions extends History {
  push(data: string | HistoryDataType): void
  replace(data: string | HistoryDataType): void
}

type HistoryDataType = {
  pathname?: string
  query?: { [key: string]: any }
  search?: string
}

function baseProcessHistory(history: History): ProcessHistoryOptions {
  const _push = history.push
  const _replace = history.replace

  // url
  // {pathname query search}
  history.push = function (one: any) {
    if (!_.isPlainObject(one)) {
      return _push(one)
    }

    const o: HistoryDataType = Object.assign({}, one as HistoryDataType)

    if (o.query) {
      o.search = stringify(o.query)
    }

    _push.apply(this, [o])
  }

  history.replace = function (one: any) {
    if (!_.isPlainObject(one)) {
      return _replace(one)
    }

    const o = Object.assign({}, one as HistoryDataType)

    if (o.query) {
      o.search = stringify(o.query)
    }

    _replace.apply(this, [o])
  }

  return history
}

function processHistory(history: History): ProcessHistoryOptions {
  console.warn('processHistory不再对外暴露，请直接使用history')
  return baseProcessHistory(history)
}

export { processHistory }
export default baseProcessHistory(history)

import _ from 'lodash'
import { stringify } from 'query-string'

interface ProcessHistoryOptions {
  push(data: string | HistoryDataType): void
  replace(data: string | HistoryDataType): void
}

type HistoryDataType = {
  pathname?: string
  query?: { [key: string]: any }
  search?: string
}

function processHistory(history: ProcessHistoryOptions) {
  const _push = history.push
  const _replace = history.replace

  // url
  // {pathname query search}
  history.push = function (one) {
    if (!_.isPlainObject(one)) {
      return _push(one)
    }

    const o: HistoryDataType = Object.assign({}, one as HistoryDataType)

    if (o.query) {
      o.search = stringify(o.query)
    }

    _push.apply(this, [o])
  }

  history.replace = function (one) {
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

export default processHistory

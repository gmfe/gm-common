const countMap: { [id: string]: number } = {}

/**
 * 任务调度，任务多次调用的时候，响应最新的，旧的不响应
 */
function promiseTaskOrder(key: string, task: () => Promise<any>) {
  if (countMap[key] === undefined) {
    countMap[key] = 0
  }

  const _count = ++countMap[key]

  return task().then(
    (resolveData) => {
      const count = countMap[key]
      // 是之前的 task，不响应
      if (_count < count) {
        return new Promise(() => {})
      }
      return resolveData
    },
    (rejectReason) => {
      const count = countMap[key]
      // 是之前的 task，不响应
      if (_count < count) {
        // 是之前的 service，不响应
        return new Promise(() => {})
      }

      // eslint-disable-next-line promise/no-return-wrap
      return Promise.reject(rejectReason)
    },
  )
}

export default promiseTaskOrder

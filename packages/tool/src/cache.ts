type Type = string

interface cachedData {
  data: any
  timer?: number
  startTime: number
}

const cache = new Map<Type, cachedData>()

/**
 * data 需要能被 JSON 序列化
 */
const set = (key: Type, cacheTime: number, data: any) => {
  const currentCache = cache.get(key)
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer)
  }

  let timer

  if (cacheTime > -1) {
    // 数据在不活跃 cacheTime 后，删除掉
    timer = window.setTimeout(() => {
      cache.delete(key)
    }, cacheTime)
  }

  cache.set(key, {
    data: JSON.stringify(data),
    timer,
    startTime: new Date().getTime(),
  })
}

const get = (key: Type) => {
  const currentCache = cache.get(key)

  if (currentCache?.data) {
    return JSON.parse(currentCache.data)
  }
}

const remove = (key: Type) => {
  const currentCache = cache.get(key)
  if (currentCache) {
    clearTimeout(currentCache.timer)
    cache.delete(key)
  }
}

const Cache = { get, set, remove }

export default Cache

import { instance } from './request'

function configProgress(
  startCallback: () => void,
  doneCallback: () => void,
  /** 不需要走configProgress样式的请求 */
  excludedRequest: string[] = [],
): void {
  instance.interceptors.request.use((config) => {
    if (excludedRequest?.every((url) => !url.includes(config.url!)))
      startCallback()
    return config
  })
  instance.interceptors.response.use(
    (response) => {
      if (excludedRequest.every((url) => !url.includes(response.config.url!)))
        doneCallback()
      return response
    },
    (error) => {
      doneCallback()
      return Promise.reject(error)
    },
  )
}

export default configProgress

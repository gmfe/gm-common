import { instance } from './request'

function configProgress(
  startCallback: () => void,
  doneCallback: () => void,
  /** 不需要走configProgress样式的请求 */
  excludedRequest: string[] = [],
): void {
  instance.interceptors.request.use((config) => {
    if (excludedRequest?.every((url) => !config.url?.includes(url))) {
      startCallback()
    }
    return config
  })
  instance.interceptors.response.use(
    (response) => {
      if (excludedRequest.every((url) => !response.config.url?.includes(url))) {
        doneCallback()
      }
      return response
    },
    (error) => {
      doneCallback()
      return Promise.reject(error)
    },
  )
}

export default configProgress

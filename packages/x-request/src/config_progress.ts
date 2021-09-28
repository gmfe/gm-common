import { instance } from './request'

function configProgress(
  startCallback: (config) => void,
  doneCallback: (response) => void,
): void {
  instance.interceptors.request.use((config) => {
    startCallback(config)
    return config
  })
  instance.interceptors.response.use(
    (response) => {
      doneCallback(response)
      return response
    },
    (error) => {
      doneCallback(error)
      return Promise.reject(error)
    },
  )
}

export default configProgress

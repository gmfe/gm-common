import { instance } from './request'

function configProgress(
  startCallback?: (config) => void,
  doneCallback?: (response) => void,
): void {
  instance.interceptors.request.use((config) => {
    startCallback && startCallback(config)
    return config
  })
  instance.interceptors.response.use(
    (response) => {
      doneCallback && doneCallback(response)
      return response
    },
    (error) => {
      doneCallback && doneCallback(error)
      return Promise.reject(error)
    },
  )
}

export default configProgress

import { instance, Request } from './request'

import configHeaders from './config_headers'
import configTrace from './config_trace'
import configError from './config_error'
import configProgress from './config_progress'
import { initAuth, clearAuth, setAccessToken } from './init'

export {
  instance,
  Request,
  configHeaders,
  configTrace,
  configError,
  configProgress,
  initAuth,
  clearAuth,
  setAccessToken,
}
export { formatErrorMessage } from './util'
export type { Response } from './types'

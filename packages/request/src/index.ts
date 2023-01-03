import { instance, Request } from './request'

// 默认配置好 headers
import configHeaders from './config_headers'
import configTrace from './config_trace'
import configError from './config_error'
import configProgress from './config_progress'
import configRetry from './config_retry'
import autoCancel from './auto_cancel'
export {
  instance,
  Request,
  configHeaders,
  configTrace,
  configError,
  configProgress,
  configRetry,
  autoCancel,
}

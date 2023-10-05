import pino from 'pino'
import ecsFormat from '@elastic/ecs-pino-format'

import { config } from '~/src/config'

function createLogger() {
  return pino({
    enabled: !config.get('isTest'),
    level: config.get('logLevel'),
    ...(config.get('isDevelopment')
      ? { transport: { target: 'pino-pretty' } }
      : ecsFormat())
  })
}

export { createLogger }

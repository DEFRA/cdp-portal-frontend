import pino from 'pino'

import { config } from '~/src/config'
const ecsFormat = require('@elastic/ecs-pino-format')

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

import ecsFormat from '@elastic/ecs-pino-format'

import { config } from '~/src/config'

const isDevelopment = config.get('isDevelopment')

const loggerOptions = {
  enabled: !config.get('isTest'),
  ignorePaths: ['/health'],
  redact: {
    paths: isDevelopment
      ? [
          'req',
          'req.id',
          'req.method',
          'req.remoteAddress',
          'req.remotePort',
          'req.headers',
          'res',
          'responseTime',
          'auditDetail'
        ]
      : ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  },
  level: config.get('logLevel'),
  ...(config.get('isDevelopment')
    ? { transport: { target: 'pino-pretty' } }
    : ecsFormat())
}

export { loggerOptions }

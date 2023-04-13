import { config } from '~/src/config'
import hapiPino from 'hapi-pino'

const requestLogger = {
  plugin: hapiPino,
  options: {
    enabled: !config.get('isTest'),
    level: config.get('logLevel'),
    ...(config.get('isDevelopment') && {
      transport: { target: 'pino-pretty' }
    })
  }
}

export { requestLogger }

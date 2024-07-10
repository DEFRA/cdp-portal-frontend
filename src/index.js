import process from 'node:process'

import { config } from '~/src/config/config'
import { stopServer } from '~/src/server/common/helpers/stop-server'
import { startServer } from '~/src/server/common/helpers/start-server'
import { createLogger } from '~/src/server/common/helpers/logging/logger'

const logger = createLogger()
const serverPromise = startServer()

process.on('unhandledRejection', (error) => {
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})

if (!config.get('isDevelopment')) {
  process.on('SIGINT', () => serverPromise.then(stopServer))
  process.on('SIGTERM', () => serverPromise.then(stopServer))
}

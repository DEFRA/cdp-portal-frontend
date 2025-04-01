import process from 'node:process'

import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { startServer } from '~/src/server/common/helpers/start-server.js'
import {doLogin} from "~/src/server/oidctester.js";

//await startServer()

await doLogin()

process.on('unhandledRejection', (error) => {
  const logger = createLogger()
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})

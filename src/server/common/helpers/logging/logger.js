import pino from 'pino'

import { logDestination, loggerOptions } from './logger-options.js'

const logger = pino(loggerOptions, logDestination)

export function createLogger() {
  return logger
}

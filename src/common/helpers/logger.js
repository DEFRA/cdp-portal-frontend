const pino = require('pino')
const { config } = require('../../config')

function createLogger() {
  return pino({
    enabled: !config.get('isTest'),
    level: config.get('logLevel'),
    ...(config.get('isDevelopment') && {
      transport: { target: 'pino-pretty' },
    }),
  })
}

module.exports.createLogger = createLogger

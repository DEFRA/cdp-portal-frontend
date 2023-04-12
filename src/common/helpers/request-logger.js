const { config } = require('../../config')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    enabled: !config.get('isTest'),
    level: config.get('logLevel'),
    ...(config.get('isDevelopment') && {
      transport: { target: 'pino-pretty' },
    }),
  },
}

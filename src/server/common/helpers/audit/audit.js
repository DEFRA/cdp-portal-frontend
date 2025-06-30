import pino from 'pino'
import { config } from '~/src/config/config.js'

const customLevels = {
  audit: 999
}

const auditLoggerConfig = {
  level: 'audit',
  customLevels,
  useOnlyCustomLevels: true,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: null,
  formatters: {
    level(label) {
      return { 'log.level': label.toLowerCase() }
    }
  }
}

const auditLogger = pino(auditLoggerConfig)

export function audit(messageOrObj, ...rest) {
  auditLogger.audit(messageOrObj, ...rest)
}

export const auditing = {
  plugin: {
    name: 'auditing',
    register: (server, options) => {
      if (!options.enabled) {
        server.logger.info('Disabling auditing')
        auditLogger.level = 'silent'
      }
      server.decorate('server', 'audit', {
        sendMessage: audit,
        send: audit
      })
      server.decorate('request', 'audit', {
        sendMessage: audit,
        send: audit
      })
    }
  },
  options: {
    enabled: config.get('audit.enabled')
  }
}

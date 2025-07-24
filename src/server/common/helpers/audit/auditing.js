import { config } from '../../../../config/config.js'
import { audit, enableAuditing } from '@defra/cdp-auditing'
import { auditMessage } from './audit-message.js'

export const auditing = {
  plugin: {
    name: 'auditing',
    register: (server, options) => {
      server.logger.info(`auditing enabled: ${options.enabled}`)
      enableAuditing(options.enabled)
      server.decorate('server', 'audit', {
        sendMessage: audit,
        send: audit
      })
      server.decorate('request', 'audit', {
        sendMessage: (m) => audit(auditMessage(m)),
        send: audit
      })
    }
  },
  options: {
    enabled: config.get('audit.enabled')
  }
}

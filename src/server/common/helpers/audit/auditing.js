import { config } from '../../../../config/config.js'
import { audit, enableAuditing } from '@defra/cdp-auditing'

function auditingDecorator(request) {
  return {
    sendMessage: ({ event, data }) => {
      const { id, email, displayName } = request.auth.credentials

      return audit({ event, data, user: { id, email, displayName } })
    },
    send: audit
  }
}

export const auditing = {
  plugin: {
    name: 'auditing',
    register: (server, options) => {
      server.logger.info(`auditing enabled: ${options.enabled}`)
      enableAuditing(options.enabled)

      server.decorate('request', 'audit', auditingDecorator, { apply: true })
    }
  },
  options: {
    enabled: config.get('audit.enabled')
  }
}

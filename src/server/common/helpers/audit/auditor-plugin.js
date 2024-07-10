import { createAuditor } from '~/src/server/common/helpers/audit/auditor'

const auditing = {
  plugin: {
    name: 'audit-plugin',
    register: async (server, options) => {
      if (!options.source) {
        server.logger.error(
          `You must set a source name (typically the service name) as an option on the audit plugin, e.g.
   server.register({
     plugin: auditingPlugin,
     options: {
      source: 'your-service-name'
     }
   })`
        )
        throw new Error('No source set for auditing')
      }

      const auditor = createAuditor(options.source)
      server.decorate('server', 'audit', auditor)
      server.decorate('request', 'audit', auditor)
    }
  },
  options: {
    source: 'cdp-portal-frontend'
  }
}

export { auditing }

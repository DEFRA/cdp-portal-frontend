import { config } from '~/src/config/config'
import { FirehoseClient } from '@aws-sdk/client-firehose'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { sendAuditMessage } from '~/src/server/common/helpers/audit/send-audit-message'

const auditing = {
  plugin: {
    name: 'audit-plugin',
    register: async (server, options) => {
      if (!options.source) {
        throw new Error('No source specified in audit-plugin options!')
      }

      const firehoseClient = new FirehoseClient({
        credentials: fromNodeProviderChain(),
        region: config.get('awsRegion'),
        ...(config.get('isProduction')
          ? {}
          : { endpoint: 'http://localhost:4566' }) // localstack
      })

      /**
       * @param {!string} transactionId
       * @param {!(string|Object)} message
       * @param {Object.<string, string>} tags
       */
      async function audit(id, message, tags = {}) {
        return await sendAuditMessage(firehoseClient, server.logger, {
          id,
          source: options.source,
          message,
          tags
        })
      }

      server.decorate('server', 'audit', audit)
      server.decorate('request', 'audit', audit)
    }
  }
}

export { auditing }

import { config } from '~/src/config/config'
import { FirehoseClient } from '@aws-sdk/client-firehose'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { sendAuditMessage } from '~/src/server/common/helpers/audit/send-audit-message'
import { stubAuditMessage } from '~/src/server/common/helpers/audit/stub-audit-message'

/**
 * Usage: server.audit( '123456', `log from ${user}`, {eventType: 'user-login'})
 *        request.audit('445566', {code: 200, path: '/foo'})
 * @type {{plugin: {name: string, register: ((function(*, *): Promise<void>)|*)}}}
 */
const auditing = {
  plugin: {
    name: 'audit-plugin',
    register: async (server, options) => {
      if (!options.source) {
        throw new Error('No "source" specified in audit-plugin options!')
      }

      if (config.get('auditingEnabled')) {
        enableAuditing(server, options)
      } else {
        enableStubbedAuditing(server, options)
      }
    }
  }
}

/**
 * Validates and sends audit records to the auditing stack via FireHose.
 * @param server
 * @param options
 */
function enableAuditing(server, options) {
  const firehoseClient = new FirehoseClient({
    credentials: fromNodeProviderChain(),
    region: config.get('awsRegion')
  })

  const audit = async (id, message, tags = {}) => {
    await sendAuditMessage(firehoseClient, {
      id,
      source: options.source,
      message,
      tags
    })
  }

  server.logger.info('Auditing is ENABLED')

  server.decorate('server', 'audit', audit)
  server.decorate('request', 'audit', audit)
}

/**
 * A fake version of the audit client for local development.
 * It just validates the payload and logs the Id that was audited.
 * @param server
 * @param options
 */
function enableStubbedAuditing(server, options) {
  server.logger.info('Auditing is DISABLED! Using stubbed auditing instead')

  if (config.get('isProduction')) {
    server.logger.error('Auditing is DISABLED in a production environment!')
  }

  const stubbedAudit = async (id, message, tags = {}) => {
    await stubAuditMessage({
      id,
      source: options.source,
      message,
      tags
    })
  }

  server.decorate('server', 'audit', stubbedAudit)
  server.decorate('request', 'audit', stubbedAudit)
}

export { auditing }

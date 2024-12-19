import noop from 'lodash/noop.js'

import { config } from '~/src/config/config.js'
import { DevAuditor } from '~/src/server/common/helpers/audit/dev-auditor.js'
import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor.js'

/**
 * @typedef {object} Options
 * @property {object} audit - Audit configuration
 * @property {import('@hapi/hapi').Request} request - Request object
 * @property {import('pino').Logger} logger
 * @property {string} region - AWS region
 * @property {boolean} isDevelopment - Development flag
 */

/**
 * If audit is enabled, provide live AWS auditor for production use, if in development provide a local
 * development and debug auditor
 * @param {Options} options
 * @returns {AwsAuditor|DevAuditor|{sendMessage: (...args: any[]) => void, send: (...args: any[]) => void}}
 */
function createAuditor(options) {
  if (options.audit.enabled) {
    return new AwsAuditor(options)
  }

  if (options.isDevelopment) {
    return new DevAuditor(options)
  }

  return {
    send: noop, // @deprecated use sendMessage
    sendMessage: noop
  }
}

const auditor = {
  plugin: {
    name: 'auditor',
    register: (server, options) => {
      server.decorate(
        'request',
        'audit',
        (request) =>
          createAuditor({
            audit: options.audit,
            request,
            logger: request.server.logger,
            region: options.region,
            isDevelopment: options.isDevelopment
          }),
        { apply: true }
      )
    }
  },
  options: {
    audit: config.get('audit'),
    region: config.get('aws.region'),
    isDevelopment: config.get('isDevelopment')
  }
}

export { auditor }

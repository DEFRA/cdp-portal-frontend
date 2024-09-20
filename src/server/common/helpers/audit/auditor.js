import { noop } from 'lodash'

import { config } from '~/src/config'
import { DevAuditor } from '~/src/server/common/helpers/audit/dev-auditor'
import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor'

/**
 * @typedef {object} Options
 * @property  {object} audit - Audit configuration
 * @property {Request} request - Request object
 * @property {Logger} logger - Logger object
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
  name: 'auditor',
  register: (
    server,
    {
      audit,
      logger = server.logger,
      region = config.get('aws.region'),
      isDevelopment = config.get('isDevelopment')
    }
  ) => {
    server.decorate(
      'request',
      'audit',
      (request) =>
        createAuditor({ audit, request, logger, region, isDevelopment }),
      { apply: true }
    )
  }
}

export { auditor }
/**
 * @import {Request} from '@hapi/hapi'
 * @import {Logger} from 'pino'
 */

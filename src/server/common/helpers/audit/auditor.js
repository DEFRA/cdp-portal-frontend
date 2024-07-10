import { noop } from 'lodash'

import { config } from '~/src/config'
import { DevAuditor } from '~/src/server/common/helpers/audit/dev-auditor'
import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor'

/**
 * If audit is enabled, provide live AWS auditor for production use, if in development provide a local
 * development and debug auditor
 * @param options
 * @returns {AwsAuditor|DevAuditor|{send: (...args: any[]) => void}}
 */
function createAuditor(options) {
  if (options.audit.enabled) {
    return new AwsAuditor(options)
  }

  if (options.isDevelopment) {
    return new DevAuditor(options)
  }

  return {
    send: noop
  }
}

const auditor = {
  name: 'auditor',
  register: async (
    server,
    {
      audit,
      logger = server.logger,
      region = config.get('awsRegion'),
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

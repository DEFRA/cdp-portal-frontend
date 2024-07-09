import { DevAuditor } from '~/src/server/common/helpers/audit/dev-auditor'
import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor'
import { config } from '~/src/config'

/**
 * If audit is enabled, provide live AWS auditor for production use, otherwise provide a local development and debug
 * auditor
 * @param options
 * @returns {AwsAuditor|DevAuditor}
 */
function createAuditor(options) {
  if (options.audit.enabled) {
    return new AwsAuditor(options)
  }

  return new DevAuditor(options)
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
    const auditor = (request) =>
      createAuditor({ audit, request, logger, region, isDevelopment })

    // server.decorate('server', 'audit', auditor)
    server.decorate('request', 'audit', auditor, {
      apply: true
    })
  }
}

export { auditor }

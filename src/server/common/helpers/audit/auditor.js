import { DevAuditor } from '~/src/server/common/helpers/audit/impl/dev-auditor'
import { AwsAuditor } from '~/src/server/common/helpers/audit/impl/aws-auditor'
import { config } from '~/src/config/config'

function createAuditor(source) {
  if (config.get('auditingEnabled')) {
    // Live auditor for production use
    return new AwsAuditor(source)
  } else {
    // Local development & debug auditor
    return new DevAuditor(source)
  }
}

export { createAuditor }

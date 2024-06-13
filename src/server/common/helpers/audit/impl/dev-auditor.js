import { createLogger } from '~/src/server/common/helpers/logging/logger'
import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'

/**
 * A pretend audit client for local development.
 * DevAuditor uses the same payload validation as the real auditor so you can test your audit message
 * generation outside of the real environments.
 */
class DevAuditor {
  constructor(source) {
    this.source = source
    this.logger = createLogger()
  }

  async send(cdpRequestId, message, tags = {}, source = this.source) {
    const payload = {
      cdpRequestId,
      source,
      message,
      tags
    }

    const { error, value } = auditSchema.validate(payload)
    if (error) {
      this.logger.error(`Invalid audit payload: ${error}`)
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      this.logger.info(
        `Mock Audit: ${value.cdpRequestId}, ${JSON.stringify(payload)}`
      )
    }
  }
}

export { DevAuditor }

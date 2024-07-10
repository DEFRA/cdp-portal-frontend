import { isUndefined } from 'lodash'

import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'

/**
 * A development audit client for local development.
 *
 * DevAuditor uses the same payload validation as the real auditor, so you can test your audit message
 * generation in development.
 */
class DevAuditor {
  constructor(options) {
    this.options = options
    this.logger = options.logger
    this.request = options.request
  }

  async send(message, tags = {}) {
    const cdpRequestId = 'x-cdp-request-id-header-not-set'
    this.logger.info(`Auditing ${cdpRequestId}`)

    const source = this.options.audit.source
    const { error, value: validatedPayload } = auditSchema.validate({
      cdpRequestId,
      source,
      message,
      tags
    })

    if (!isUndefined(error)) {
      this.logger.error(`Invalid audit payload: ${error}`)
      return
    }

    const auditDetail = {
      ...validatedPayload,
      created: validatedPayload.created.toISOString()
    }

    this.logger.info(
      { auditDetail },
      `Mock Audit: ${validatedPayload.cdpRequestId}${typeof validatedPayload.message === 'string' ? ' - ' + validatedPayload.message : ''}`
    )
  }
}

export { DevAuditor }

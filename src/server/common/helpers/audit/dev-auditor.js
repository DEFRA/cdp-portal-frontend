import { isUndefined } from 'lodash'

import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'
import { auditMessageSchema } from '~/src/server/common/helpers/audit/schema/audit-message-schema'
import { auditMessage } from '~/src/server/common/helpers/audit/audit-message'

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
    this.logger.info(`Mock Audit - Request id: ${cdpRequestId}`)

    const source = this.options.audit.source
    const { error, value: validatedPayload } = auditSchema.validate({
      cdpRequestId,
      source,
      message,
      tags
    })

    if (!isUndefined(error)) {
      this.logger.error(
        `Mock Audit Invalid payload - Request id: ${cdpRequestId}: ${error}`
      )
      return
    }

    const auditDetail = {
      ...validatedPayload,
      created: validatedPayload.created.toISOString()
    }

    this.logger.info(
      { auditDetail },
      `Mock Audit delivered - Request id: ${validatedPayload.cdpRequestId}${typeof validatedPayload.message === 'string' ? ' : ' + validatedPayload.message : ''}`
    )
  }

  async sendMessage(message, tags = {}) {
    const { error: validationError, value: validatedPayload } =
      auditMessageSchema.validate(auditMessage(message))

    if (!isUndefined(validationError)) {
      this.logger.error(`Audit invalid message payload: ${validationError}`)
      return
    }
    this.send(validatedPayload, tags)
  }
}

export { DevAuditor }

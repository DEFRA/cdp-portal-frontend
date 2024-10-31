import isUndefined from 'lodash/isUndefined.js'

import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema.js'
import { auditMessageSchema } from '~/src/server/common/helpers/audit/schema/audit-message-schema.js'
import { auditMessage } from '~/src/server/common/helpers/audit/audit-message.js'
import { sanitize } from '~/src/server/common/helpers/sanitize.js'

/**
 * A development audit client for local development.
 * DevAuditor uses the same payload validation as the real auditor, so you can test your audit message
 * generation in development.
 */
class DevAuditor {
  constructor(options) {
    this.options = options
    this.logger = options.logger
    this.request = options.request
  }

  send(message, tags = {}) {
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
        sanitize(error.message),
        `Mock Audit Invalid payload - Request id: ${cdpRequestId}`
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

  sendMessage(message, tags = {}) {
    const { error: validationError, value: validatedPayload } =
      auditMessageSchema.validate(auditMessage(message))

    if (!isUndefined(validationError)) {
      this.logger.error(
        sanitize(validationError.message),
        'Audit invalid message payload'
      )
      return
    }

    this.send(validatedPayload, tags)
  }
}

export { DevAuditor }

import { auditSchema } from '~/src/server/common/helpers/audit/audit-schema'
import { createLogger } from '~/src/server/common/helpers/logging/logger'

const logger = createLogger()
/**
 * @param {{message, id, tags}} payload payload
 * @returns {Promise<void>}
 */
async function stubAuditMessage(payload) {
  const { error, value } = auditSchema.validate(payload)

  if (error) {
    logger.error(`MockAudit: Invalid audit payload: ${error}`)
    return
  }

  logger.info(`MockAudit send for ${value.id}`)
}

export { stubAuditMessage }

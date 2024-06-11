import { PutRecordCommand } from '@aws-sdk/client-firehose'
import { auditSchema } from '~/src/server/common/helpers/audit/audit-schema'
import { config } from '~/src/config/config'
import { createLogger } from '~/src/server/common/helpers/logging/logger'

const logger = createLogger()

/**
 * @param { FirehoseClient } firehoseClient
 * @param {{message, id, tags}} payload payload
 * @returns {Promise<void>}
 */
const sendAuditMessage = async (firehoseClient, payload) => {
  const { error, warning, value } = auditSchema.validate(payload)

  if (error) {
    logger.error(`Invalid audit payload: ${error}`)
    return
  }

  if (warning) {
    logger.warn(warning)
  }

  try {
    const cmd = new PutRecordCommand({
      DeliveryStreamName: config.get('auditStream'),
      Record: {
        Data: Buffer.from(JSON.stringify(value))
      }
    })

    const response = await firehoseClient.send(cmd)
    logger.info(`AUDITED: ${response?.RecordId}`)
  } catch (e) {
    logger.error(`Failed to send audit: ${e}`)
  }
}

export { sendAuditMessage }

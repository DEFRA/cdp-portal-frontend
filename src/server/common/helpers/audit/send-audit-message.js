import { PutRecordCommand } from '@aws-sdk/client-firehose'
import { auditSchema } from '~/src/server/common/helpers/audit/audit-schema'
import { config } from '~/src/config/config'

/**
 *
 * @param { FirehoseClient } firehoseClient
 * @param { pino.Logger } logger
 * @param {{message, transactionId, tags}} payload payload
 * @returns {Promise<void>}
 */
const sendAuditMessage = async (firehoseClient, logger, payload) => {
  // TODO: bail out early if not in prod envs

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

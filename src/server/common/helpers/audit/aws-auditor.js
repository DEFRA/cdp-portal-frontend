import isUndefined from 'lodash/isUndefined.js'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema.js'
import { auditMessageSchema } from '~/src/server/common/helpers/audit/schema/audit-message-schema.js'
import { auditMessage } from '~/src/server/common/helpers/audit/audit-message.js'
import { sanitize } from '~/src/server/common/helpers/sanitize.js'
import { getTraceId } from '@defra/hapi-tracing'

class AwsAuditor {
  constructor(options) {
    this.options = options
    this.logger = options.logger
    this.request = options.request
    this.firehose = this.firehose ?? this.buildFireHouseClient()
  }

  buildFireHouseClient() {
    const awsFirehoseEndpoint = this.options.audit?.awsFirehoseEndpoint
    const firehoseConfig = {
      credentials: fromNodeProviderChain(),
      region: this.options.region,
      ...(awsFirehoseEndpoint && { endpoint: awsFirehoseEndpoint })
    }

    return new FirehoseClient(firehoseConfig)
  }

  async send(message, tags = {}) {
    const cdpRequestId = getTraceId()
    this.logger.info(`Audit - Request id: ${cdpRequestId}`)

    const source = this.options.audit.source
    const { error: validationError, value: validatedPayload } =
      auditSchema.validate({
        cdpRequestId,
        source,
        service: source,
        message,
        tags
      })

    if (!isUndefined(validationError)) {
      this.logger.error(
        sanitize(validationError.message),
        `Audit invalid payload - Request id: ${cdpRequestId}`
      )
      return
    }

    try {
      const auditStream = this.options.audit.stream
      const response = await this.firehose.send(
        new PutRecordCommand({
          DeliveryStreamName: auditStream,
          Record: {
            Data: Buffer.from(
              JSON.stringify({
                ...validatedPayload,
                created: validatedPayload.created.toISOString()
              })
            )
          }
        })
      )
      this.logger.info(
        `Audit delivered - Request id: ${cdpRequestId}: ${response?.RecordId}`
      )
    } catch (error) {
      this.logger.error(
        `Audit failed - Request id: ${cdpRequestId} - ${error.message}`
      )
    }
  }

  async sendMessage(message, tags = {}) {
    const { error: validationError, value: validatedPayload } =
      auditMessageSchema.validate(auditMessage(message))

    if (!isUndefined(validationError)) {
      this.logger.error(
        sanitize(validationError.message),
        'Audit invalid message payload'
      )
      return
    }

    await this.send(validatedPayload, tags)
  }
}

export { AwsAuditor }

import { isUndefined } from 'lodash'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'
import { auditMessageSchema } from '~/src/server/common/helpers/audit/schema/audit-message-schema'
import { auditMessage } from '~/src/server/common/helpers/audit/audit-message'

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
    const cdpRequestId = this.request.headers['x-cdp-request-id']
    this.logger.info(`Audit - Request id: ${cdpRequestId}`)

    const source = this.options.audit.source
    const { error: validationError, value: validatedPayload } =
      auditSchema.validate({
        cdpRequestId,
        message,
        tags,
        source
      })

    if (!isUndefined(validationError)) {
      this.logger.error(
        `Audit invalid payload - Request id: ${cdpRequestId}: ${validationError}`
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
      this.logger.error(`Audit invalid message payload: ${validationError}`)
      return
    }
    this.send(validatedPayload, tags)
  }
}

export { AwsAuditor }

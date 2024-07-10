import { isUndefined } from 'lodash'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'

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
    this.logger.info(`Auditing ${cdpRequestId}`)

    const source = this.options.audit.source
    const { error: validationError, value: validatedPayload } =
      auditSchema.validate({
        cdpRequestId,
        message,
        tags,
        source
      })

    if (!isUndefined(validationError)) {
      this.logger.error(`Invalid audit payload: ${validationError}`)
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
      this.logger.info(`Audit delivered: ${response?.RecordId}`)
    } catch (error) {
      this.logger.error(`Failed to send audit: ${error}`)
    }
  }
}

export { AwsAuditor }

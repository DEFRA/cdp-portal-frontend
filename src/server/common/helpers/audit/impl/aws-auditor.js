import { config } from '~/src/config/config'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'
import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'
import { createLogger } from '~/src/server/common/helpers/logging/logger'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

class AwsAuditor {
  static _firehose
  _source = 'cdp-portal-frontend'

  constructor(sourceId) {
    this._source = sourceId
    this.logger = createLogger()

    if (!AwsAuditor._firehose) {
      this.logger.info('Building AWS Firehose client for Auditing')
      AwsAuditor._firehose = new FirehoseClient({
        credentials: fromNodeProviderChain(),
        region: config.get('awsRegion'),
        endpoint: 'http://localhost:4566'
      })
      this.logger.info('AWS Firehose client created')
    }
  }

  async send(cdpRequestId, message, tags = {}, source = this._source) {
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

    try {
      const cmd = new PutRecordCommand({
        DeliveryStreamName: config.get('auditStream'),
        Record: {
          Data: Buffer.from(JSON.stringify(value))
        }
      })

      const response = await AwsAuditor._firehose.send(cmd)
      this.logger.info(`Audit delivered: ${response?.RecordId}`)
    } catch (e) {
      this.logger.error(`Failed to send audit: ${e}`)
    }
  }
}

export { AwsAuditor }

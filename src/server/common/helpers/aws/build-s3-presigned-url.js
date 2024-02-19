import { fromEnv } from '@aws-sdk/credential-providers'
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { formatUrl } from '@aws-sdk/util-format-url'
import { HttpRequest } from '@smithy/protocol-http'
import { parseUrl } from '@smithy/url-parser'
import { Hash } from '@smithy/hash-node'
import { CredentialsProviderError } from '@smithy/property-provider'
import { createLogger } from '~/src/server/common/helpers/logging/logger'

async function buildS3PresignedUrl({ region, bucket, key }) {
  const logger = createLogger()

  try {
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`)
    const presigner = new S3RequestPresigner({
      credentials: fromEnv(),
      region,
      sha256: Hash.bind(null, 'sha256')
    })

    const signedUrlObject = await presigner.presign(new HttpRequest(url))
    return formatUrl(signedUrlObject)
  } catch (error) {
    if (error instanceof CredentialsProviderError) {
      logger.info(
        'To create presigned urls you need to have the appropriate AWS_* envs setup. See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/Variable/fromEnv'
      )
      logger.error(error.message)
    } else {
      throw error
    }
  }
}

export { buildS3PresignedUrl }

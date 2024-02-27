import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { formatUrl } from '@aws-sdk/util-format-url'
import { HttpRequest } from '@smithy/protocol-http'
import { parseUrl } from '@smithy/url-parser'
import { Hash } from '@smithy/hash-node'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

async function buildS3PresignedUrl({ region, bucket, key }) {
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`)
  const presigner = new S3RequestPresigner({
    credentials: fromNodeProviderChain,
    region,
    sha256: Hash.bind(null, 'sha256')
  })

  const signedUrlObject = await presigner.presign(new HttpRequest(url))
  return formatUrl(signedUrlObject)
}

export { buildS3PresignedUrl }

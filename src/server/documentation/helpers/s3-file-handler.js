import { GetObjectCommand } from '@aws-sdk/client-s3'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

function fetchS3File(request, key, bucket) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })

  return request.s3Client.send(command)
}

async function s3FileHandler(request, h, documentationPath, bucket) {
  const s3File = await fetchS3File(request, documentationPath, bucket)

  return h
    .response(s3File.Body)
    .header('Content-Type', s3File.ContentType)
    .code(statusCodes.ok)
}

export { s3FileHandler, fetchS3File }

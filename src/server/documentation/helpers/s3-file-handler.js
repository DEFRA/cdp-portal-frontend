import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3'
import { statusCodes } from '@defra/cdp-validation-kit'

function fetchS3File(request, key, bucket) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })

  return request.s3Client.send(command)
}

function fetchHeadObject(request, key, bucket) {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key
  })

  return request.s3Client.send(command)
}

function fetchListObjects(request, bucket) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
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

async function fetchMarkdown(request, bucket, documentationPath) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: documentationPath
  })
  const response = await request.s3Client.send(command)

  return response.Body.transformToString()
}

export {
  s3FileHandler,
  fetchS3File,
  fetchHeadObject,
  fetchListObjects,
  fetchMarkdown
}

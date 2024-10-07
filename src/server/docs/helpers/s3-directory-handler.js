import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'
import { statusCodes } from '~/src/server/common/constants/status-codes'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import path from 'node:path'
import { generateDocsBreadcrumbs } from '~/src/server/docs/helpers/generate-docs-breadcrumbs'

async function s3DirectoryHandler(request, h, docsPath, bucket) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: docsPath
  })

  try {
    const response = await request.s3Client.send(command)

    const directoryListing = response.Contents.map((c) => {
      return {
        name: path.basename(c.Key),
        href: path.join('/docs', c.Key)
      }
    })
    return h
      .view('docs/views/s3-directory', {
        directoryListing,
        docsPath,
        breadcrumbs: generateDocsBreadcrumbs(docsPath)
      })
      .code(statusCodes.ok)
  } catch (error) {
    request.logger.error(error)
    const statusCode = statusCodes.notFound
    const errorMessage = statusCodeMessage(statusCode)

    return h
      .view('error/minimal-error', {
        heading: statusCode,
        message: errorMessage
      })
      .code(statusCode)
  }
}

export { s3DirectoryHandler }

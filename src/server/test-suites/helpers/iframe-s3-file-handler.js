import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { statusCodeMessage } from '../../common/helpers/errors/status-code-message.js'
import { statusCodes } from '@defra/cdp-validation-kit'

/**
 * S3 file handler for use with iFrames
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {{key: string, bucket: string, environment: string, folder: string}} params
 * @returns {Promise<*>}
 */
async function iframeS3FileHandler(request, h, { key, bucket, folder }) {
  const xFrameOptions = 'SAMEORIGIN'
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })

  try {
    const response = await request.s3Client.send(command)
    return h
      .response(response.Body)
      .header('Content-Type', response.ContentType)
      .header('X-Frame-Options', xFrameOptions)
      .code(statusCodes.ok)
  } catch (error) {
    request.logger.error(error)

    const statusCode =
      error.$metadata.httpStatusCode ?? statusCodes.internalError
    const errorMessage = statusCodeMessage(statusCode)

    if (statusCode === statusCodes.notFound) {
      const files = await listSubFolder(request, bucket, folder)
      return h
        .view('test-suites/views/missing-report', {
          heading: 'No report found',
          files
        })
        .header('X-Frame-Options', xFrameOptions)
        .code(statusCode)
    }

    return h
      .view('error/minimal-error', {
        heading: statusCode,
        message: errorMessage
      })
      .header('X-Frame-Options', xFrameOptions)
      .code(statusCode)
  }
}

async function listSubFolder(request, bucket, folder) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: folder
    })
    const response = await request.s3Client.send(command)
    return response.Contents.map((c) => ({
      name: c.Key.replace(folder, ''),
      url: c.Key.replace(folder, './'),
      size: c.Size
    }))
  } catch (error) {
    request.logger.info(`Unable to list content of ${folder}`)
    return []
  }
}

export { iframeS3FileHandler }

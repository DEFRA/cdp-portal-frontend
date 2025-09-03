import { GetObjectCommand } from '@aws-sdk/client-s3'

import { statusCodeMessage } from '../../common/helpers/errors/status-code-message.js'
import { statusCodes } from '@defra/cdp-validation-kit'

/**
 * S3 file handler for use with iFrames
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {string} key
 * @param {string} bucket
 * @returns {Promise<*>}
 */
async function iframeS3FileHandler(request, h, key, bucket) {
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

    return h
      .view('error/minimal-error', {
        heading: statusCode,
        message: errorMessage
      })
      .header('X-Frame-Options', xFrameOptions)
      .code(statusCode)
  }
}

export { iframeS3FileHandler }

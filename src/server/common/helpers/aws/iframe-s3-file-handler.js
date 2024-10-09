import { GetObjectCommand } from '@aws-sdk/client-s3'

import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'
import { statusCodes } from '~/src/server/common/constants/status-codes'

/**
 * S3 file handler for use with iFrames
 * @param {Request} request
 * @param {ResponseToolkit} h
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
/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */

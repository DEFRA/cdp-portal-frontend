import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'
import { statusCodes } from '~/src/server/common/constants/status-codes'
import { GetObjectCommand } from '@aws-sdk/client-s3'

async function markdownRenderer(request, h, docsPath, bucket) {
  const xFrameOptions = 'SAMEORIGIN'

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: docsPath
  })

  try {
    const response = await request.s3Client.send(command)

    return h
      .view('docs/views/markdown-renderer', {
        markdown: await response.Body.transformToString(),
        breadcrumbs: [
          {
            text: 'Docs',
            href: '/docs'
          },
          {
            text: docsPath
          }
        ]
      })
      .header('X-Frame-Options', xFrameOptions)
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
      .header('X-Frame-Options', xFrameOptions)
      .code(statusCode)
  }
}

export { markdownRenderer }

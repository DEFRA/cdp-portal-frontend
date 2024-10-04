import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'
import { statusCodes } from '~/src/server/common/constants/status-codes'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { markdown } from '~/src/server/common/helpers/markdown/markdown'
import { generateDocsBreadcrumbs } from '~/src/server/docs/helpers/generate-docs-breadcrumbs'

async function markdownRenderer(request, h, docsPath, bucket) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: docsPath
  })

  try {
    const response = await request.s3Client.send(command)
    const md = markdown.parse(await response.Body.transformToString())

    return h
      .view('docs/views/markdown-renderer', {
        content: md,
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

export { markdownRenderer }

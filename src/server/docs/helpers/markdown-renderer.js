import fs from 'node:fs'
import path from 'node:path'

import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'
import { statusCodes } from '~/src/server/common/constants/status-codes'

function markdownRenderer(request, h, docsPath) {
  const xFrameOptions = 'SAMEORIGIN'

  try {
    // TODO replace with a call to fetch markdown files
    const markdown = fs.readFileSync(
      path.join(__dirname, `/../${docsPath}.md`),
      'utf8'
    )

    return h
      .view('docs/views/markdown-renderer', {
        markdown
      })
      .header('X-Frame-Options', xFrameOptions)
      .code(statusCodes.ok)
  } catch (error) {
    request.logger.error(error)

    // TODO get the status code from somewhere this is just hardcoded
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

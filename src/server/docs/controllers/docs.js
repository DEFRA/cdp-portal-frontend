import Joi from 'joi'
import Boom from '@hapi/boom'
import path from 'node:path'

import { markdownRenderer } from '~/src/server/docs/helpers/markdown-renderer'
import { s3FileHandler } from '~/src/server/common/helpers/aws/s3-file-handler'
import { config } from '~/src/config'

const docsController = {
  options: {
    validate: {
      params: Joi.object({
        docsPath: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const bucket = config.get('documentation.bucket')
    const docsPath = request.params.docsPath

    if (!docsPath) {
      return h.redirect(`docs/README.md`)
    }

    request.logger.info(`serving docs: ${docsPath}`)

    // Convert markdown files to html, otherwise just return the file as is.
    if (path.extname(docsPath).toLowerCase() === '.md') {
      return markdownRenderer(request, h, docsPath, bucket)
    } else {
      return s3FileHandler(request, h, docsPath, bucket)
    }
  }
}

export { docsController }

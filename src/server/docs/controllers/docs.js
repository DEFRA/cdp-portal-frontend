import Joi from 'joi'
import Boom from '@hapi/boom'
import path from 'node:path'

import { markdownRenderer } from '~/src/server/docs/helpers/markdown-renderer'
import { s3FileHandler } from '~/src/server/common/helpers/aws/s3-file-handler'
import { config } from '~/src/config'
import { s3DirectoryHandler } from '~/src/server/docs/helpers/s3-directory-handler'

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

    // Convert docs files to html, otherwise just return the file as is.
    switch (path.extname(docsPath).toLowerCase()) {
      case '':
        return s3DirectoryHandler(request, h, docsPath, bucket)
      case '.md':
        return markdownRenderer(request, h, docsPath, bucket)
      default:
        return s3FileHandler(request, h, docsPath, bucket)
    }
  }
}

export { docsController }

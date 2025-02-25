import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { s3FileHandler } from '~/src/server/documentation/helpers/s3-file-handler.js'
import { markdownHandler } from '~/src/server/documentation/helpers/markdown-handler.js'
import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message.js'
import { excludedMarkdownFiles } from '~/src/server/documentation/constants/excluded-markdown-files.js'

const documentationController = {
  options: {
    validate: {
      params: Joi.object({
        documentationPath: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const bucket = config.get('documentation.bucket')
    const documentationPath = request.params.documentationPath

    request.logger.info(`Serving documentation: ${documentationPath}`)

    try {
      if (excludedMarkdownFiles.includes(documentationPath)) {
        throw Boom.notFound()
      }

      if (documentationPath.toLowerCase().endsWith('.md')) {
        return await markdownHandler(request, h, documentationPath, bucket)
      }

      return await s3FileHandler(request, h, documentationPath, bucket)
    } catch (error) {
      request.logger.error(error)

      const statusCode =
        error?.output?.statusCode ||
        error?.$metadata?.httpStatusCode ||
        statusCodes.internalError
      const errorMessage = statusCodeMessage(statusCode)

      return h
        .view('error/index', {
          pageTitle: errorMessage,
          heading: statusCode,
          message: errorMessage
        })
        .code(statusCode)
    }
  }
}

export { documentationController }

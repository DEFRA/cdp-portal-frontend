import Joi from 'joi'
import Boom from '@hapi/boom'
import { statusCodes } from '@defra/cdp-validation-kit'

import { config } from '#config/config.js'
import { blogMarkdownHandler } from '../helpers/blog-markdown-handler.js'
import { s3FileHandler } from '#server/documentation/helpers/s3-file-handler.js'
import { statusCodeMessage } from '#server/common/helpers/errors/status-code-message.js'

const bucket = config.get('documentation.bucket')

const blogRoute = {
  options: {
    validate: {
      params: Joi.object({
        articlePath: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const articlePath = request.params.articlePath
    const articleKey = `blog/${articlePath}`

    try {
      if (!articlePath) {
        throw Boom.notFound()
      }

      if (articlePath.toLowerCase().endsWith('.md')) {
        return await blogMarkdownHandler(request, h, articlePath, bucket)
      }

      return await s3FileHandler(request, h, articleKey, bucket)
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

const blogAssetsRoute = {
  handler: async (request, h) => {
    const assetPath = request.params.assetPath

    return await s3FileHandler(request, h, `assets/${assetPath}`, bucket)
  }
}

export { blogRoute, blogAssetsRoute }

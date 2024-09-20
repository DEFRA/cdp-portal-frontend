import Joi from 'joi'
import Boom from '@hapi/boom'

import { markdownRenderer } from '~/src/server/docs/helpers/markdown-renderer'

const docsController = {
  options: {
    validate: {
      params: Joi.object({
        docsPath: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const docsPath = request.params.docsPath

    return markdownRenderer(request, h, docsPath)
  }
}

export { docsController }

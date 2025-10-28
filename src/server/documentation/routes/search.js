import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '../../../config/config.js'
import { searchIndex } from '../helpers/search-index.js'

const searchRoute = {
  options: {
    validate: {
      query: Joi.object({
        q: Joi.string().allow('').required()
      }),
      failAction: () => Boom.badRequest()
    }
  },
  handler: async (request) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

    const query = request.query.q
    const bucket = config.get('documentation.bucket')
    const suggestions = await searchIndex(request, bucket, query)

    return { message: 'Search results', suggestions }
  }
}

export { searchRoute }

import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { searchIndex } from '~/src/server/documentation/helpers/search-index.js'

const searchController = {
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

export { searchController }

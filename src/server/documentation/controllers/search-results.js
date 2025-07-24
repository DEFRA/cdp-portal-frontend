import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '../../../config/config.js'
import { statusCodes } from '../../common/constants/status-codes.js'
import { searchIndex } from '../helpers/search-index.js'
import { renderComponent } from '../../common/helpers/nunjucks/render-component.js'
import { buildDocsNav } from '../helpers/markdown/build-docs-nav.js'

const searchResultsController = {
  options: {
    validate: {
      query: Joi.object({
        q: Joi.string().allow('')
      }),
      failAction: () => Boom.badRequest()
    }
  },
  handler: async (request, h) => {
    const searchTerm = request.query?.q
    const bucket = config.get('documentation.bucket')
    const nav = await buildDocsNav(request, bucket)
    const suggestions = await searchIndex(request, bucket, searchTerm)
    const html = renderComponent('search-results', { results: suggestions })

    return h
      .view('documentation/views/documentation', {
        pageTitle: 'Documentation - Search Results',
        content: html,
        breadcrumbs: [
          {
            text: 'CDP',
            href: '/documentation'
          },
          {
            text: 'Search Results'
          }
        ],
        nav,
        suggestions
      })
      .code(statusCodes.ok)
  }
}

export { searchResultsController }

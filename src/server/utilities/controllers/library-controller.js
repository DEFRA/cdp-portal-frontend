import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchLibraries } from '~/src/server/utilities/helpers/fetch/fetch-libraries.js'
import { transformRepositoryToSummary } from '~/src/server/utilities/transformers/repository-to-summary.js'

const libraryController = {
  options: {
    validate: {
      params: Joi.object({
        libraryId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { repository } = await fetchLibraries(request.params?.libraryId)

    return h.view('utilities/views/library', {
      pageTitle: repository.id,
      summaryList: transformRepositoryToSummary(repository),
      repository,
      breadcrumbs: [
        {
          text: 'Utilities',
          href: '/utilities/templates'
        },
        {
          text: 'Libraries',
          href: '/utilities/libraries'
        },
        {
          text: repository.id
        }
      ]
    })
  }
}

export { libraryController }

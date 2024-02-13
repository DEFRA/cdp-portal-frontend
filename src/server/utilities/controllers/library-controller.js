import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchLibrary } from '~/src/server/utilities/helpers/fetch/fetch-library'
import { repositoryToEntityDataList } from '~/src/server/utilities/transformers/repository-to-entity-data-list'

const libraryController = {
  options: {
    validate: {
      params: Joi.object({
        libraryId: Joi.string().required
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { libraries } = await fetchLibrary(request.params?.libraryId)
    const library = libraries?.at(0) // TODO theres some work to be done in the API around returning a single library

    return h.view('utilities/views/library', {
      pageTitle: library.id,
      heading: library.id,
      entityDataList: repositoryToEntityDataList(library),
      library,
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
          text: library.id
        }
      ]
    })
  }
}

export { libraryController }

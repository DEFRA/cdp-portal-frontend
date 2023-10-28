import { startCase } from 'lodash'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchLibrary } from '~/src/server/utilities/helpers/fetch-library'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'

const libraryController = {
  options: {
    validate: {
      query: Joi.object({
        libraryId: Joi.string().required
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { libraries } = await fetchLibrary(request.params?.libraryId)
    const library = libraries?.at(0) // TODO theres some work to be done in the API around returning a library

    return h.view('utilities/views/library', {
      pageTitle: library.id,
      heading: startCase(library.id),
      entityDataList: transformRepositoryToEntityDataList(library),
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
      ],
      subNavigation: [
        {
          isActive: false,
          url: '/utilities/templates',
          label: 'Templates'
        },
        {
          isActive: true,
          url: '/utilities/libraries',
          label: 'Libraries'
        }
      ]
    })
  }
}

export { libraryController }

import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { fetchLibrary } from '~/src/server/utilities/helpers/fetch-library'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'

const libraryController = {
  handler: async (request, h) => {
    try {
      const { library } = await fetchLibrary(request.params?.libraryId)

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
    } catch (error) {
      return Boom.boomify(error)
    }
  }
}

export { libraryController }

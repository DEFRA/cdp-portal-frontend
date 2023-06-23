import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'
import { fetchLibrary } from '~/src/server/utilities/helpers/fetch-library'

const appPathPrefix = appConfig.get('appPathPrefix')

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
            href: `${appConfig.get('appPathPrefix')}/utilities/templates`
          },
          {
            text: 'Libraries',
            href: `${appConfig.get('appPathPrefix')}/utilities/libraries`
          },
          {
            text: library.id
          }
        ],
        subNavigation: [
          {
            isActive: false,
            url: `${appPathPrefix}/utilities/templates`,
            label: 'Templates'
          },
          {
            isActive: true,
            url: `${appPathPrefix}/utilities/libraries`,
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

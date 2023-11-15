import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchLibraries } from '~/src/server/utilities/helpers/fetch-libraries'
import { transformUtilityToEntityRow } from '~/src/server/utilities/transformers/transform-utility-to-entity-row'

const librariesListController = {
  handler: async (request, h) => {
    const { libraries } = await fetchLibraries()

    const entityRows = libraries
      ?.sort(sortBy('id', 'asc'))
      ?.map(transformUtilityToEntityRow('libraries'))

    return h.view('utilities/views/list', {
      pageTitle: 'Libraries',
      heading: 'Libraries',
      entityRows,
      subNavigation: [
        {
          isActive: request?.path === '/utilities/templates' ?? false,
          url: '/utilities/templates',
          label: 'Templates'
        },
        {
          isActive: request?.path === '/utilities/libraries' ?? false,
          url: '/utilities/libraries',
          label: 'Libraries'
        }
      ],
      headingCaption: 'Organisational packages and libraries.',
      noResult: 'Currently there are no libraries'
    })
  }
}

export { librariesListController }

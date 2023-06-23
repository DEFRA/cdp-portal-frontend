import { appConfig } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchLibraries } from '~/src/server/common/helpers/fetch-libraries'
import { transformUtilityToEntityRow } from '~/src/server/utilities/transformers/transform-utility-to-entity-row'

const appPathPrefix = appConfig.get('appPathPrefix')

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
          isActive:
            request?.path === `${appPathPrefix}/utilities/templates` ?? false,
          url: `${appPathPrefix}/utilities/templates`,
          label: 'Templates'
        },
        {
          isActive:
            request?.path === `${appPathPrefix}/utilities/libraries` ?? false,
          url: `${appPathPrefix}/utilities/libraries`,
          label: 'Libraries'
        }
      ],
      headingCaption: 'Organisational packages and libraries.',
      noResult: 'Currently there are no libraries'
    })
  }
}

export { librariesListController }

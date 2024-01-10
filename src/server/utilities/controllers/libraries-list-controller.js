import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchLibraries } from '~/src/server/utilities/helpers/fetch/fetch-libraries'
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
      headingCaption: 'Organisational packages and libraries.',
      noResult: 'Currently there are no libraries'
    })
  }
}

export { librariesListController }

import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { fetchLibraries } from '~/src/server/utilities/helpers/fetch/fetch-libraries.js'
import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row.js'

const librariesListController = {
  handler: async (_request, h) => {
    const { repositories } = await fetchLibraries()

    const entityRows = repositories
      ?.sort(sortBy('id', 'asc'))
      ?.map(utilityToEntityRow('libraries'))

    return h.view('utilities/views/list', {
      pageTitle: 'Libraries',
      heading: 'Libraries',
      entityRows,
      noResult: 'Currently there are no libraries'
    })
  }
}

export { librariesListController }

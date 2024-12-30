import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { fetchTemplates } from '~/src/server/utilities/helpers/fetch/fetch-templates.js'
import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row.js'

const templatesListController = {
  handler: async (_request, h) => {
    const { repositories } = await fetchTemplates()

    const entityRows = repositories
      ?.sort(sortBy('id', 'asc'))
      ?.map(utilityToEntityRow('templates'))

    return h.view('utilities/views/list', {
      pageTitle: 'Templates',
      heading: 'Templates',
      entityRows,
      noResult: 'Currently there are no templates'
    })
  }
}

export { templatesListController }

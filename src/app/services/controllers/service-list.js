import { fetchRepositories } from '~/src/app/services/helpers/fetch-repositories'
import { sortBy } from '~/src/common/helpers/sort-by'
import { transformServiceToEntityRow } from '~/src/app/services/transformers/transform-service-to-entity-row'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const entityRows = repositories
      ?.sort(sortBy('id', 'asc'))
      ?.map(transformServiceToEntityRow)

    return h.view('services/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }

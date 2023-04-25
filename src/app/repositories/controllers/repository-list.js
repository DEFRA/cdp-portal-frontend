import { fetchRepositories } from '~/src/app/repositories/helpers/fetch-repositories'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformRepositoryToEntityRow } from '~/src/app/repositories/transformers/transform-service-to-entity-row'

const repositoryListController = {
  handler: async (request, h) => {
    const repositories = await fetchRepositories()
    const entityRows = repositories
      .sort(sortByTimestamp())
      .map(transformRepositoryToEntityRow)

    return h.view('repositories/views/repository-list', {
      pageTitle: 'Repositories',
      heading: 'Repositories',
      entityRows
    })
  }
}

export { repositoryListController }

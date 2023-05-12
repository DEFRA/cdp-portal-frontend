import { fetchCodeRepositories } from '~/src/app/code-repositories/helpers/fetch-code-repositories'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformCodeRepositoryToEntityRow } from '~/src/app/code-repositories/transformers/transform-code-repository-to-entity-row'

const codeRepositoryListController = {
  handler: async (request, h) => {
    const codeRepositories = await fetchCodeRepositories()
    const entityRows = codeRepositories
      .sort(sortByTimestamp())
      .map(transformCodeRepositoryToEntityRow)

    return h.view('code-repositories/views/list', {
      pageTitle: 'Code Repositories',
      heading: 'Code Repositories',
      entityRows
    })
  }
}

export { codeRepositoryListController }

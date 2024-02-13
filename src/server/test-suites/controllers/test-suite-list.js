import { sortBy } from '~/src/server/common/helpers/sort-by'

import { fetchTestSuites } from '~/src/server/test-suites/helpers/fetch'
import { fetchRepositories } from '~/src/server/services/helpers/fetch/fetch-repositories'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row'

const testSuiteListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const testSuites = await fetchTestSuites()
    const decorator = repositoriesDecorator(repositories)

    const entityRows = testSuites
      .map(decorator)
      ?.sort(sortBy('serviceName', 'asc'))
      ?.map(transformTestSuiteToEntityRow)

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      heading: 'Test Suites',
      entityRows
    })
  }
}

export { testSuiteListController }

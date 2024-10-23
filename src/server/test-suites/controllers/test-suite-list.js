import { sortBy } from '~/src/server/common/helpers/sort/sort-by'

import { fetchTestSuitesWithLastTestRun } from '~/src/server/test-suites/helpers/fetch'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories'
import { testSuiteRepositoriesDecorator } from '~/src/server/test-suites/helpers/decorators/test-suite-repositories'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row'
import { testTypeDecorator } from '~/src/server/test-suites/helpers/decorators/test-type'

const testSuiteListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const decorateRepositories = repositoriesDecorator(repositories)
    const testSuiteDecorator =
      testSuiteRepositoriesDecorator(decorateRepositories)
    const testSuites = await fetchTestSuitesWithLastTestRun()

    request.logger.debug({ repositories, testSuites }, 'Test suites fetched')

    const entityRows = testSuites
      .map(testSuiteDecorator)
      .map(testTypeDecorator)
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

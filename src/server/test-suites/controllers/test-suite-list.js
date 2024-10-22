import { sortBy } from '~/src/server/common/helpers/sort/sort-by'

import { fetchTestSuites } from '~/src/server/test-suites/helpers/fetch'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row'
import { testRunDecorator } from '~/src/server/test-suites/helpers/decorators/test-run'
import { testTypeDecorator } from '~/src/server/test-suites/helpers/decorators/test-type'

const testSuiteListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const decorateRepositories = repositoriesDecorator(repositories)
    const testSuites = await fetchTestSuites()
    const testSuitesWithLastRun = await Promise.all(
      testSuites.map(testRunDecorator)
    )
    request.logger.debug(
      { repositories, testSuites, testSuitesWithLastRun },
      'Test suites fetched'
    )

    const entityRows = testSuitesWithLastRun
      .map(decorateRepositories)
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

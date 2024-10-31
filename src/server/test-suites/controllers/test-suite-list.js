import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

import { fetchTestSuitesWithLastTestRun } from '~/src/server/test-suites/helpers/fetch/index.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { testSuiteRepositoriesDecorator } from '~/src/server/test-suites/helpers/decorators/test-suite-repositories.js'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'
import { testTypeDecorator } from '~/src/server/test-suites/helpers/decorators/test-type.js'

const testSuiteListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const decorateRepositories = repositoriesDecorator(repositories)
    const testSuiteDecorator =
      testSuiteRepositoriesDecorator(decorateRepositories)
    const testSuites = await fetchTestSuitesWithLastTestRun()

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

import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'

import { fetchTestSuites } from '~/src/server/test-suites/helpers/fetch/index.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { testSuiteDecorator } from '~/src/server/test-suites/helpers/decorators/test-suite.js'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

const testSuiteListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const testSuites = await fetchTestSuites()

    const entityRows = testSuites
      .map(testSuiteDecorator(repositories))
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

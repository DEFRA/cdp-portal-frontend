import { validate as uuidValidate } from 'uuid'

import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { fetchTestSuites } from '~/src/server/test-suites/helpers/fetch/index.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { testSuiteDecorator } from '~/src/server/test-suites/helpers/decorators/test-suite.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { testSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

const testSuiteListController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.scope.filter(uuidValidate) ?? []

    const [testSuites, { repositories }] = await Promise.all([
      fetchTestSuites(),
      fetchRepositories()
    ])

    const decorator = testSuiteDecorator(repositories, userScopeUUIDs)
    const rowBuilder = testSuiteToEntityRow(isAuthenticated)
    const ownerSorter = sortByOwner('serviceName')

    const rows = testSuites
      ?.map(decorator)
      .toSorted(ownerSorter)
      .map(rowBuilder)

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      tableData: {
        headers: [
          ...(isAuthenticated
            ? [{ id: 'owner', classes: 'app-entity-table__cell--owned' }]
            : []),
          { id: 'test-suite', text: 'Test Suite', width: '15' },
          { id: 'team', text: 'Team', width: '15' },
          { id: 'kind', text: 'Kind', width: '10' },
          { id: 'github-repository', text: 'GitHub Repository', width: '20' },
          { id: 'last-ran', text: 'Last Ran', width: '20' },
          { id: 'created', text: 'Created', width: '20' }
        ],
        rows,
        noResult: 'No test suites found'
      }
    })
  }
}

export { testSuiteListController }

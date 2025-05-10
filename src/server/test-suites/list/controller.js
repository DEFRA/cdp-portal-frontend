import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { entityOwnerDecorator } from '~/src/server/test-suites/helpers/decorators/entity-owner-decorator.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { testSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

const testSuiteListController = {
  options: {
    id: 'test-suites',
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const [testSuites] = await Promise.all([fetchTestSuites()])

    const ownerDecorator = entityOwnerDecorator(userScopeUUIDs)
    const ownerSorter = sortByOwner('name')

    const rows = testSuites
      ?.map(ownerDecorator)
      .toSorted(ownerSorter)
      .map(testSuiteToEntityRow)

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      tableData: {
        isWide: true,
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          {
            id: 'test-suite',
            text: 'Test Suite',
            width: '35',
            isLeftAligned: true
          },
          { id: 'team', text: 'Team', width: '25' },
          { id: 'kind', text: 'Kind', width: '15' },
          { id: 'created', text: 'Created', width: '25' }
        ],
        rows,
        noResult: 'No test suites found'
      }
    })
  }
}

export { testSuiteListController }

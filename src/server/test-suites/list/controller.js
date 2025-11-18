import { fetchTestSuites } from '../../common/helpers/fetch/fetch-entities.js'
import { sortByOwner } from '../../common/helpers/sort/sort-by-owner.js'
import { entityOwnerDecorator } from '../helpers/decorators/entity-owner-decorator.js'
import { testSuiteToEntityRow } from '../transformers/test-suite-to-entity-row.js'

const testSuiteListController = {
  options: {
    id: 'test-suites'
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const userScope = userSession?.scope ?? []

    const [testSuites] = await Promise.all([fetchTestSuites()])

    const ownerDecorator = entityOwnerDecorator(userScope)
    const ownerSorter = sortByOwner('name')

    const rows = testSuites
      ?.map(ownerDecorator)
      .toSorted(ownerSorter)
      .map(testSuiteToEntityRow)

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      tableData: {
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
        noResult: 'No test suites found',
        isWide: true
      }
    })
  }
}

export { testSuiteListController }

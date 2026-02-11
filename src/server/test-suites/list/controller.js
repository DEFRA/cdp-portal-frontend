import { fetchTestSuites } from '../../common/helpers/fetch/fetch-entities.js'
import { sortByOwner } from '../../common/helpers/sort/sort-by-owner.js'
import { entityOwnerDecorator } from '../helpers/decorators/entity-owner-decorator.js'

const testSuiteListController = {
  options: {
    id: 'test-suites'
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const userScope = userSession?.scope ?? []

    const testSuites = await fetchTestSuites()

    const ownerDecorator = entityOwnerDecorator(userScope)
    const ownerSorter = sortByOwner('name')

    const rows = testSuites?.map(ownerDecorator).toSorted(ownerSorter)

    const filters = {
      service: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: { selected: true }
        },
        { value: 'cdp-portal-backend', text: 'cdp-portal-backend' },
        { value: 'cdp-portal-frontend', text: 'cdp-portal-frontend' },
        { value: 'cdp-postgres-service', text: 'cdp-postgres-service' },
        { value: 'cdp-self-service-ops', text: 'cdp-self-service-ops' },
        { value: 'cdp-service-prototype', text: 'cdp-service-prototype' },
        { value: 'tenant-backend', text: 'tenant-backend' }
      ],
      team: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: { selected: true }
        },
        { value: 'platform', text: 'Platform' },
        { value: 'tenantteam1', text: 'TenantTeam1' }
      ]
    }

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
        isWide: true,
        isInverse: true
      },
      testSuiteFilters: filters.testSuite,
      teamFilters: filters.team
    })
  }
}

export { testSuiteListController }

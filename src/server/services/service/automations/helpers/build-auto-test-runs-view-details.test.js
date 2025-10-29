import { buildAutoTestRunsViewDetails } from './build-auto-test-runs-view-details.js'
import { fetchTestSuites } from '../../../../common/helpers/fetch/fetch-entities.js'
import { getAutoTestRunDetails } from './fetchers.js'

vi.mock('../../../../common/helpers/fetch/fetch-entities.js')
vi.mock('./fetchers.js')

describe('With an Admin user', () => {
  test('Should provide expected context tabs', async () => {
    fetchTestSuites.mockResolvedValueOnce([
      { name: 'test-suite-1', type: 'TestSuite', subType: 'Journey' },
      { name: 'test-suite-2', type: 'TestSuite', subType: 'Journey' }
    ])
    fetchTestSuites.mockResolvedValueOnce([
      { name: 'test-suite-1', type: 'TestSuite', subType: 'Journey' },
      { name: 'test-suite-3', type: 'TestSuite', subType: 'Performance' }
    ])

    getAutoTestRunDetails.mockResolvedValueOnce([])

    const { testSuiteOptions, rows } = await buildAutoTestRunsViewDetails({
      serviceTeams: [{ teamId: 'mock-team-id' }, { teamId: 'mock-team-id-2' }],
      serviceId: 'mock-service-id',
      environments: ['dev', 'test', 'prod']
    })

    expect(testSuiteOptions.length).toEqual(3)
    expect(rows.length).toBe(0)
  })
})

import { fetchTestSuites } from '#server/common/helpers/fetch/fetch-entities.js'
import { fetchFilters } from '#server/common/helpers/fetch/fetch-filters.js'
import { testSuiteListController } from './controller.js'
import { entityOwnerDecorator } from '../helpers/decorators/entity-owner-decorator.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/fetch/fetch-filters.js')
vi.mock('../helpers/decorators/entity-owner-decorator.js')

describe('testSuiteListController.handler', () => {
  let h
  let request
  const mockUserSession = vi.fn().mockReturnValue({
    isAuthenticated: true,
    scope: ['scope-1']
  })

  const mockFetchFilters = {
    entities: ['cdp-env-test-suite', 'test-one'],
    teams: [
      { teamId: 'platform', name: 'Platform' },
      { teamId: 'tenantteam1', name: 'TenantTeam1' }
    ]
  }

  beforeEach(() => {
    h = {
      view: vi.fn()
    }

    request = {
      auth: { credentials: mockUserSession() },
      query: {}
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should return a view with correct data when test suites are available', async () => {
    const testSuitesMock = [{ id: 1, name: 'Test Suite 1' }]

    fetchTestSuites.mockResolvedValue(testSuitesMock)
    fetchFilters.mockResolvedValue(mockFetchFilters)
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
    expect(fetchFilters).toHaveBeenCalled()
    expect(entityOwnerDecorator).toHaveBeenCalledWith(['scope-1'])

    expect(h.view).toHaveBeenCalledWith(
      'test-suites/views/list',
      expect.objectContaining({
        pageTitle: 'Test Suites',
        tableData: expect.objectContaining({
          rows: testSuitesMock
        })
      })
    )
  })

  test('should handle the case when no test suites are available', async () => {
    fetchTestSuites.mockResolvedValue([])
    fetchFilters.mockResolvedValue(mockFetchFilters)
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
    expect(fetchFilters).toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith(
      'test-suites/views/list',
      expect.objectContaining({
        pageTitle: 'Test Suites',
        tableData: expect.objectContaining({
          rows: [],
          noResult: 'No test suites found'
        })
      })
    )
  })

  test('should return an empty view if no test suites are found and user is not authenticated', async () => {
    mockUserSession.mockReturnValue({
      isAuthenticated: false,
      scope: ['scope-1']
    })

    fetchTestSuites.mockResolvedValue([])
    fetchFilters.mockResolvedValue(mockFetchFilters)
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
    expect(fetchFilters).toHaveBeenCalled()
    expect(h.view).toHaveBeenCalledWith(
      'test-suites/views/list',
      expect.objectContaining({
        pageTitle: 'Test Suites',
        tableData: expect.objectContaining({
          rows: [],
          noResult: 'No test suites found'
        })
      })
    )
  })

  test('should have a validation fail of 404', async () => {
    expect(testSuiteListController.options.validate.failAction()).toEqual(
      expect.objectContaining({
        message: 'Not Found'
      })
    )
  })
})

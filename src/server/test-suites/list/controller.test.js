import { fetchTestSuites } from '../../common/helpers/fetch/fetch-entities.js'
import { testSuiteListController } from './controller.js'
import { entityOwnerDecorator } from '../helpers/decorators/entity-owner-decorator.js'
import { testSuiteToEntityRow } from '../transformers/test-suite-to-entity-row.js'

vi.mock('../../common/helpers/fetch/fetch-entities.js')
vi.mock('../helpers/decorators/entity-owner-decorator.js')
vi.mock('../transformers/test-suite-to-entity-row.js')
vi.mock('../../common/helpers/auth/pre/provide-authed-user.js')

describe('testSuiteListController.handler', () => {
  let h
  let request
  const mockGetUserSession = vi.fn().mockReturnValue({
    isAuthenticated: true,
    uuidScope: ['scope-1']
  })

  beforeEach(() => {
    h = {
      view: vi.fn()
    }

    request = {
      getUserSession: mockGetUserSession
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should return a view with correct data when test suites are available', async () => {
    const testSuitesMock = [{ id: 1, name: 'Test Suite 1' }]

    fetchTestSuites.mockResolvedValue(testSuitesMock)
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite
    testSuiteToEntityRow.mockReturnValue({ row: 'data' })

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
    expect(entityOwnerDecorator).toHaveBeenCalledWith(['scope-1'])
    expect(testSuiteToEntityRow).toHaveBeenCalledWith(
      { id: 1, name: 'Test Suite 1' },
      0,
      [{ id: 1, name: 'Test Suite 1' }]
    )
    expect(h.view).toHaveBeenCalledWith(
      'test-suites/views/list',
      expect.objectContaining({
        pageTitle: 'Test Suites',
        tableData: expect.objectContaining({
          rows: [{ row: 'data' }]
        })
      })
    )
  })

  test('should handle the case when no test suites are available', async () => {
    fetchTestSuites.mockResolvedValue([])
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite
    testSuiteToEntityRow.mockReturnValue(() => ({}))

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
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
    mockGetUserSession.mockReturnValue({
      isAuthenticated: false,
      uuidScope: ['scope-1']
    })

    fetchTestSuites.mockResolvedValue([])
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite
    testSuiteToEntityRow.mockReturnValue(() => ({}))

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
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
})

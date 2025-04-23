import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { testSuiteListController } from '~/src/server/test-suites/list/controller.js'
import { entityOwnerDecorator } from '~/src/server/test-suites/helpers/decorators/entity-owner-decorator.js'
import { testSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock(
  '~/src/server/test-suites/helpers/decorators/entity-owner-decorator.js'
)
jest.mock('~/src/server/test-suites/transformers/test-suite-to-entity-row.js')
jest.mock('~/src/server/common/helpers/auth/pre/provide-authed-user.js')

describe('testSuiteListController.handler', () => {
  let h
  let request

  beforeEach(() => {
    h = {
      view: jest.fn()
    }

    request = {
      pre: {
        authedUser: {
          isAuthenticated: true,
          uuidScope: ['scope-1']
        }
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return a view with correct data when test suites are available', async () => {
    const testSuitesMock = [{ id: 1, name: 'Test Suite 1' }]

    fetchTestSuites.mockResolvedValue(testSuitesMock)
    entityOwnerDecorator.mockReturnValue((testSuite) => testSuite) // Mocking decorator to return the same test suite
    testSuiteToEntityRow.mockReturnValue((isAuthenticated) =>
      isAuthenticated ? { row: 'data' } : {}
    )

    await testSuiteListController.handler(request, h)

    expect(fetchTestSuites).toHaveBeenCalled()
    expect(entityOwnerDecorator).toHaveBeenCalledWith(['scope-1'])
    expect(testSuiteToEntityRow).toHaveBeenCalledWith(true)
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
    request.pre.authedUser.isAuthenticated = false

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

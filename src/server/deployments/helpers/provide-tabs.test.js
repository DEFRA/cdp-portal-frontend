import { provideTabs } from './provide-tabs.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

const mockRequest = ({ response, path = '', scope = [] }) => ({
  response,
  path,
  getUserSession: vi.fn().mockResolvedValue({
    scope
  })
})

describe('#provideTabs', () => {
  const mockResponse = {
    variety: 'view',
    source: {}
  }
  const mockViewHelper = {
    continue: 'mockContinue'
  }

  afterEach(() => {
    mockResponse.source = {}
  })

  describe('With an Admin user', () => {
    test('Should provide expected context tabs', async () => {
      await provideTabs(
        mockRequest({
          response: mockResponse,
          scope: [scopes.admin, scopes.externalTest]
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'Infra-dev',
          url: '/deployments/infra-dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Management',
          url: '/deployments/management?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Ext-test',
          url: '/deployments/ext-test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50'
        }
      ])
    })

    test('Should mark matching url as Active', async () => {
      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: '/deployments/infra-dev',
          scope: [scopes.admin]
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'Infra-dev',
          url: '/deployments/infra-dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Management',
          url: '/deployments/management?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50'
        }
      ])
    })
  })

  describe('With a Non-Admin user', () => {
    test('Should provide expected context tabs', async () => {
      await provideTabs(
        mockRequest({ response: mockResponse, scope: [] }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50'
        }
      ])
    })

    test('Should mark matching url as Active', async () => {
      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: '/deployments/dev',
          scope: []
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50'
        }
      ])
    })
  })
})

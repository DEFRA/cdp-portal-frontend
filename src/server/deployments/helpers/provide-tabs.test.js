import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const mockRequest = ({ response, path = '', scope = [] }) => ({
  response,
  path,
  getUserSession: jest.fn().mockResolvedValue({
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
          url: '/deployments/infra-dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Management',
          url: '/deployments/management?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Ext-test',
          url: '/deployments/ext-test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50',
          isSlim: true
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
          url: '/deployments/infra-dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Management',
          url: '/deployments/management?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Dev',
          url: '/deployments/dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50',
          isSlim: true
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
          url: '/deployments/dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50',
          isSlim: true
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
          url: '/deployments/dev?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Test',
          url: '/deployments/test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/deployments/perf-test?page=1&size=50',
          isSlim: true
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/deployments/prod?page=1&size=50',
          isSlim: true
        }
      ])
    })
  })
})

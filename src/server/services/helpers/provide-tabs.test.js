import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs'

const mockRequest = ({ response, path = '', isAdmin }) => ({
  response,
  path,
  getUserSession: jest.fn().mockResolvedValue({
    isAdmin
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
        mockRequest({ response: mockResponse, isAdmin: true }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
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
          isAdmin: true
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
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
        mockRequest({ response: mockResponse, isAdmin: false }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
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
          isAdmin: false
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
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

import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs'

const mockRequest = (response, path = '') => ({ response, path })

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

  test('Should provide expected context tabs', () => {
    provideTabs(mockRequest(mockResponse), mockViewHelper)

    expect(mockResponse.source.context.tabs).toEqual([
      {
        isActive: false,
        label: 'Infra-dev',
        url: '/deployments/infra-dev'
      },
      {
        isActive: false,
        label: 'Management',
        url: '/deployments/management'
      },
      {
        isActive: false,
        label: 'Dev',
        url: '/deployments/dev'
      },
      {
        isActive: false,
        label: 'Test',
        url: '/deployments/test'
      },
      {
        isActive: false,
        label: 'Perf-test',
        url: '/deployments/perf-test'
      },
      {
        isActive: false,
        label: 'Prod',
        url: '/deployments/prod'
      }
    ])
  })

  test('Should mark matching url as Active', () => {
    provideTabs(
      mockRequest(mockResponse, '/deployments/infra-dev'),
      mockViewHelper
    )

    expect(mockResponse.source.context.tabs).toEqual([
      {
        isActive: true,
        label: 'Infra-dev',
        url: '/deployments/infra-dev'
      },
      {
        isActive: false,
        label: 'Management',
        url: '/deployments/management'
      },
      {
        isActive: false,
        label: 'Dev',
        url: '/deployments/dev'
      },
      {
        isActive: false,
        label: 'Test',
        url: '/deployments/test'
      },
      {
        isActive: false,
        label: 'Perf-test',
        url: '/deployments/perf-test'
      },
      {
        isActive: false,
        label: 'Prod',
        url: '/deployments/prod'
      }
    ])
  })
})

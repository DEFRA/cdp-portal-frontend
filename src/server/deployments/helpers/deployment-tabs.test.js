import { deploymentTabs } from '~/src/server/deployments/helpers/deployment-tabs'

const mockRequest = (path = '') => ({ path })

describe('#deploymentTabs', () => {
  test('Should provide expected deployment tabs details', () => {
    expect(deploymentTabs(mockRequest())).toEqual([
      {
        isActive: false,
        label: 'Management',
        url: '/deployments/management'
      },
      {
        isActive: false,
        label: 'Infra-dev',
        url: '/deployments/infra-dev'
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
    expect(deploymentTabs(mockRequest('/deployments/infra-dev'))).toEqual([
      {
        isActive: false,
        label: 'Management',
        url: '/deployments/management'
      },
      {
        isActive: true,
        label: 'Infra-dev',
        url: '/deployments/infra-dev'
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

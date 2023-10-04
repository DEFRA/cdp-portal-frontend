import { config } from '~/src/config'
import { deploymentTabs } from '~/src/server/deployments/helpers/deployment-tabs'

const appPathPrefix = config.get('appPathPrefix')
const mockRequest = (path = '') => ({ path })

describe('#deploymentTabs', () => {
  test('Should provide expected deployment tabs details', () => {
    expect(deploymentTabs(mockRequest())).toEqual([
      {
        isActive: false,
        label: 'Management',
        url: '/cdp-portal-frontend/deployments/management'
      },
      {
        isActive: false,
        label: 'Infra-dev',
        url: '/cdp-portal-frontend/deployments/infra-dev'
      },
      {
        isActive: false,
        label: 'Dev',
        url: '/cdp-portal-frontend/deployments/dev'
      },
      {
        isActive: false,
        label: 'Test',
        url: '/cdp-portal-frontend/deployments/test'
      },
      {
        isActive: false,
        label: 'Perf-test',
        url: '/cdp-portal-frontend/deployments/perf-test'
      },
      {
        isActive: false,
        label: 'Prod',
        url: '/cdp-portal-frontend/deployments/prod'
      }
    ])
  })

  test('Should mark matching url as Active', () => {
    expect(
      deploymentTabs(mockRequest(`${appPathPrefix}/deployments/infra-dev`))
    ).toEqual([
      {
        isActive: false,
        label: 'Management',
        url: '/cdp-portal-frontend/deployments/management'
      },
      {
        isActive: true,
        label: 'Infra-dev',
        url: '/cdp-portal-frontend/deployments/infra-dev'
      },
      {
        isActive: false,
        label: 'Dev',
        url: '/cdp-portal-frontend/deployments/dev'
      },
      {
        isActive: false,
        label: 'Test',
        url: '/cdp-portal-frontend/deployments/test'
      },
      {
        isActive: false,
        label: 'Perf-test',
        url: '/cdp-portal-frontend/deployments/perf-test'
      },
      {
        isActive: false,
        label: 'Prod',
        url: '/cdp-portal-frontend/deployments/prod'
      }
    ])
  })
})

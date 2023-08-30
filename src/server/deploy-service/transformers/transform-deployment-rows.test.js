import { deploymentSessionFixture } from '~/src/__fixtures__/deployment-session'
import { transformDeploymentRows } from '~/src/server/deploy-service/transformers/transform-deployment-rows'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { cpuOptionsFixture } from '~/src/__fixtures__/cpu-options'
import { ecsCpuToMemoryOptionsMapFixture } from '~/src/__fixtures__/ecs-cpu-to-memory-options-map'

jest.mock('~/src/server/deploy-service/helpers/fetch-deploy-service-options')

describe('#transformDeploymentRows', () => {
  beforeEach(() => {
    fetchDeployServiceOptions.mockResolvedValue({
      cpuOptions: cpuOptionsFixture,
      ecsCpuToMemoryOptionsMap: ecsCpuToMemoryOptionsMapFixture
    })
  })

  test('Should provide expected deployment row transformation', async () => {
    expect(await transformDeploymentRows(deploymentSessionFixture)).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Image name'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Image name'
        },
        value: {
          html: 'cdp-portal-frontend'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Image version'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Image version'
        },
        value: {
          html: '0.8.0'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Environment'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Environment'
        },
        value: {
          html: 'Management'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/options?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Instance count'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Instance count'
        },
        value: {
          html: '4'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/options?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'CPU size'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'CPU size'
        },
        value: {
          html: '2048 (2 vCPU)\n    <div class="app-info-hint">\n      256 (.25 vCPU) automatically allocated to platform processes. You have <strong>1792 (1.75 vCPU)</strong> available.\n    </div>'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/deploy-service/options?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Memory allocation'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Memory allocation'
        },
        value: {
          html: '9 GB\n    <div class="app-info-hint">\n      .25 GB (256 MB) automatically allocated to platform processes. You have <strong>8.75 GB (8960 MB)</strong> available.\n    </div>'
        }
      }
    ])
  })
})

import { deploymentSessionFixture } from '~/src/__fixtures__/deploy-service/deployment-session'
import { transformDeploymentRows } from '~/src/server/deploy-service/transformers/transform-deployment-rows'
import { cpuOptionsFixture } from '~/src/__fixtures__/deploy-service/cpu-options'
import { ecsCpuToMemoryOptionsMapFixture } from '~/src/__fixtures__/deploy-service/ecs-cpu-to-memory-options-map'

jest.mock(
  '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'
)

describe('#transformDeploymentRows', () => {
  test('Should provide expected deployment row transformation', () => {
    expect(
      transformDeploymentRows(
        deploymentSessionFixture,
        cpuOptionsFixture.at(1),
        ecsCpuToMemoryOptionsMapFixture['1024']?.at(4)
      )
    ).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/deploy-service/details?redirectLocation=summary',
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
              href: '/deploy-service/details?redirectLocation=summary',
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
              href: '/deploy-service/details?redirectLocation=summary',
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
              href: '/deploy-service/options?redirectLocation=summary',
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
              href: '/deploy-service/options?redirectLocation=summary',
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
          html: '1024 (1 vCPU)'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/deploy-service/options?redirectLocation=summary',
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
          html: '6 GB (6144 MB)'
        }
      }
    ])
  })
})

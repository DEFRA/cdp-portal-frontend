import { describe, expect, test } from 'vitest'
import { deploymentSessionFixture } from '../../../__fixtures__/deploy-service/deployment-session.js'
import { deploymentRows } from './deployment-rows.js'
import { cpuOptionsFixture } from '../../../__fixtures__/deploy-service/cpu-options.js'
import { ecsCpuToMemoryOptionsMapFixture } from '../../../__fixtures__/deploy-service/ecs-cpu-to-memory-options-map.js'

vi.mock('../../common/helpers/fetch/fetch-deploy-service-options.js')

describe('#deploymentRows', () => {
  test('Should provide expected deployment row transformation', () => {
    expect(
      deploymentRows(
        deploymentSessionFixture,
        cpuOptionsFixture.at(1),
        ecsCpuToMemoryOptionsMapFixture['1024']?.at(4),
        'fa39d9d2-d591-4bf8-b741-005d900e696c'
      )
    ).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/deploy-service/details/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
              href: '/deploy-service/details/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
              href: '/deploy-service/details/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
          html: 'management'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/deploy-service/options/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
              href: '/deploy-service/options/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
          html: '1 vCPU'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/deploy-service/options/fa39d9d2-d591-4bf8-b741-005d900e696c?redirectLocation=summary',
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
          html: '6 GB'
        }
      }
    ])
  })
})

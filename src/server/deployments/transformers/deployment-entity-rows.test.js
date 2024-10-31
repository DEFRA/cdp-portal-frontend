import compose from 'lodash/fp/compose.js'

import { deploymentsFixture } from '~/src/__fixtures__/deployments.js'
import { undeploymentsFixture } from '~/src/__fixtures__/undeployments.js'
import { servicesFixture } from '~/src/__fixtures__/services.js'
import { deploymentEntityRows } from '~/src/server/deployments/transformers/deployment-entity-rows.js'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'

describe('#deploymentEntityRows', () => {
  test('Should provide expected deployed service transformation', () => {
    expect(
      compose(
        deploymentEntityRows,
        decorateDeployments(servicesFixture)
      )(deploymentsFixture.data)
    ).toEqual([
      [
        {
          kind: 'link',
          url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
          value: 'cdp-self-service-ops'
        },
        {
          kind: 'group',
          value: null
        },
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-self-service-ops/releases/tag/0.133.0',
          value: '0.133.0'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'Running'
        },
        {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        {
          kind: 'date',
          value: '2023-12-14T14:04:49Z',
          withSeconds: true
        }
      ],
      [
        {
          kind: 'link',
          url: '/deployments/infra-dev/undefined',
          value: 'cdp-user-service-backend'
        },
        {
          kind: 'group',
          value: [
            {
              kind: 'link',
              url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
              value: 'Platform'
            }
          ]
        },
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-user-service-backend/releases/tag/0.54.0',
          value: '0.54.0'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'Running'
        },
        {
          kind: 'text',
          value: '- - -'
        },
        {
          kind: 'date',
          value: '2023-12-14T14:02:34Z',
          withSeconds: true
        }
      ],
      [
        {
          kind: 'link',
          url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
          value: 'cdp-portal-backend'
        },
        {
          kind: 'group',
          value: [
            {
              kind: 'link',
              url: '/teams/team1Id',
              value: 'team1'
            },
            {
              kind: 'link',
              url: '/teams/team2Id',
              value: 'team2'
            }
          ]
        },
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-portal-backend/releases/tag/0.94.0',
          value: '0.94.0'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'Running'
        },
        {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        {
          kind: 'date',
          value: '2023-12-14T13:58:13Z',
          withSeconds: true
        }
      ],
      [
        {
          kind: 'link',
          url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
          value: 'cdp-portal-frontend'
        },
        {
          kind: 'group',
          value: [
            {
              kind: 'link',
              url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
              value: 'Platform'
            }
          ]
        },
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.211.0',
          value: '0.211.0'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          value: 'Running'
        },
        {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        {
          kind: 'date',
          value: '2023-12-14T13:40:52Z',
          withSeconds: true
        }
      ]
    ])
  })

  test('Should show un-deployment events as STOPPED', () => {
    expect(
      compose(
        deploymentEntityRows,
        decorateDeployments(servicesFixture)
      )([undeploymentsFixture])
    ).toEqual([
      [
        {
          kind: 'link',
          url: '/deployments/infra-dev/3f5dff54-9bea-4a53-830d-96610af8c2b4',
          value: 'cdp-portal-frontend'
        },
        {
          kind: 'group',
          value: [
            {
              kind: 'link',
              url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
              value: 'Platform'
            }
          ]
        },
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.217.0',
          value: '0.217.0'
        },
        {
          classes: 'govuk-tag--grey',
          kind: 'tag',
          value: 'Undeployed'
        },
        {
          kind: 'text',
          value: 'The Terminator'
        },
        {
          kind: 'date',
          value: '2024-01-17T18:46:36.171Z',
          withSeconds: true
        }
      ]
    ])
  })
})

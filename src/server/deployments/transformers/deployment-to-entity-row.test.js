import { config } from '~/src/config/config.js'
import { deploymentsFixture } from '~/src/__fixtures__/deployments.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { deploymentToEntityRow } from '~/src/server/deployments/transformers/deployment-to-entity-row.js'

describe('#deploymentToEntityRow', () => {
  const oidcAdminGroupId = config.get('oidcAdminGroupId')
  const userScopeUUIDs = [oidcAdminGroupId]
  const deploymentsDecorator = decorateDeployments({
    deployableServices: servicesFixture,
    userScopeUUIDs
  })
  const deploymentsWithTeams = deploymentsDecorator(deploymentsFixture.data)

  describe('When authenticated', () => {
    test('Should provide expected table rows', () => {
      const rowBuilder = deploymentToEntityRow(true)

      expect(deploymentsWithTeams.map(rowBuilder)).toEqual([
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: ''
              },
              headers: 'owner',
              isCentered: true
            },
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-self-service-ops'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-self-service-ops/releases/tag/0.133.0',
                value: '0.133.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T14:04:49Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: expect.stringContaining('Owned Service')
              },
              headers: 'owner',
              isCentered: true
            },
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/undefined',
                value: 'cdp-user-service-backend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-user-service-backend/releases/tag/0.54.0',
                value: '0.54.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: '- - -'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: [
                  {
                    kind: 'link',
                    url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                    value: 'Platform'
                  }
                ]
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T14:02:34Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: ''
              },
              headers: 'owner',
              isCentered: true
            },
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-portal-backend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-backend/releases/tag/0.94.0',
                value: '0.94.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
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
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T13:58:13Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: expect.stringContaining('Owned Service')
              },
              headers: 'owner',
              isCentered: true
            },
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-portal-frontend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.211.0',
                value: '0.211.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: [
                  {
                    kind: 'link',
                    url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                    value: 'Platform'
                  }
                ]
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T13:40:52Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        }
      ])
    })
  })

  describe('When not authenticated', () => {
    test('Should provide expected table rows', () => {
      const rowBuilder = deploymentToEntityRow(false)

      expect(deploymentsWithTeams.map(rowBuilder)).toEqual([
        {
          cells: [
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-self-service-ops'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-self-service-ops/releases/tag/0.133.0',
                value: '0.133.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T14:04:49Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/undefined',
                value: 'cdp-user-service-backend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-user-service-backend/releases/tag/0.54.0',
                value: '0.54.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: '- - -'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: [
                  {
                    kind: 'link',
                    url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                    value: 'Platform'
                  }
                ]
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T14:02:34Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-portal-backend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-backend/releases/tag/0.94.0',
                value: '0.94.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
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
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T13:58:13Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        },
        {
          cells: [
            {
              entity: {
                kind: 'link',
                url: '/deployments/infra-dev/7dda5224-84c0-4a67-a64f-04e55d95befb',
                value: 'cdp-portal-frontend'
              },
              headers: 'deployment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.211.0',
                value: '0.211.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'service-status'
            },
            {
              entity: {
                kind: 'group',
                value: [
                  {
                    kind: 'link',
                    url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                    value: 'Platform'
                  }
                ]
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2023-12-14T13:40:52Z',
                withSeconds: true
              },
              headers: 'deployment-started'
            }
          ]
        }
      ])
    })
  })
})

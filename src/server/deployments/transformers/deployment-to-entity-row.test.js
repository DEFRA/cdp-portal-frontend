import { decorateRollouts } from './decorate-rollouts.js'
import { deploymentToEntityRow } from './deployment-to-entity-row.js'
import { deploymentsWithMigrationsFixture } from '../../../__fixtures__/deployments/deployments-with-migrations.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'

describe('#deploymentToEntityRow', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const userScopeUUIDs = [adminGroupId]
  const deploymentsDecorator = decorateRollouts({
    deployableServices: entityServicesFixture,
    userScopeUUIDs
  })
  const deploymentsWithTeams = deploymentsDecorator(
    deploymentsWithMigrationsFixture.data
  )

  test('Should provide expected table rows', () => {
    expect(deploymentsWithTeams.map(deploymentToEntityRow)).toEqual([
      {
        cells: [
          {
            classes: 'app-entity-table__cell--owned',
            entity: {
              kind: 'html',
              value: expect.stringContaining('Owned service')
            },
            headers: 'owner',
            isCentered: true
          },
          {
            headers: 'description',
            html: expect.stringContaining('cdp-example-node-postgres-be')
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.356.0',
              value: '0.356.0'
            },
            headers: 'version'
          },
          {
            entity: {
              classes: 'govuk-tag--green',
              kind: 'tag',
              value: 'Running'
            },
            headers: 'status'
          },
          {
            entity: {
              classes: 'govuk-tag--blue',
              kind: 'tag',
              value: 'Deployment'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'Mumm-ra'
            },
            headers: 'by'
          },
          {
            entity: {
              kind: 'list',
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
              value: '2025-04-30T14:48:34.001Z',
              withSeconds: true
            },
            headers: 'started'
          }
        ]
      },
      {
        cells: [
          {
            classes: 'app-entity-table__cell--owned',
            entity: {
              kind: 'html',
              value: expect.stringContaining('Owned service')
            },
            headers: 'owner',
            isCentered: true
          },
          {
            headers: 'description',
            html: expect.stringContaining('cdp-example-node-postgres-be')
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.8.0',
              value: '0.8.0'
            },
            headers: 'version'
          },
          {
            entity: {
              classes: 'govuk-tag--grey',
              kind: 'tag',
              value: 'Succeeded'
            },
            headers: 'status'
          },
          {
            entity: {
              classes: 'govuk-tag--blue',
              kind: 'tag',
              value: 'Deployment'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'B. A. Baracus'
            },
            headers: 'by'
          },
          {
            entity: {
              kind: 'list',
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
              value: '2025-04-30T09:21:54.816Z',
              withSeconds: true
            },
            headers: 'started'
          }
        ]
      },
      {
        cells: [
          {
            classes: 'app-entity-table__cell--owned',
            entity: {
              kind: 'html',
              value: expect.stringContaining('Owned service')
            },
            headers: 'owner',
            isCentered: true
          },
          {
            headers: 'description',
            html: expect.stringContaining('cdp-portal-frontend')
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-portal-frontend/releases/tag/0.356.0',
              value: '0.356.0'
            },
            headers: 'version'
          },
          {
            entity: {
              classes: 'govuk-tag--green',
              kind: 'tag',
              value: 'Running'
            },
            headers: 'status'
          },
          {
            entity: {
              classes: 'govuk-tag--blue',
              kind: 'tag',
              value: 'Deployment'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'The Terminator'
            },
            headers: 'by'
          },
          {
            entity: {
              kind: 'list',
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
              value: '2024-08-28T10:39:55.31Z',
              withSeconds: true
            },
            headers: 'started'
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
            headers: 'description',
            html: expect.stringContaining('forms-designer')
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/forms-designer/releases/tag/0.73.0',
              value: '0.73.0'
            },
            headers: 'version'
          },
          {
            entity: {
              classes: 'govuk-tag--light-blue',
              kind: 'tag',
              value: 'Stopped'
            },
            headers: 'status'
          },
          {
            entity: {
              classes: 'govuk-tag--blue',
              kind: 'tag',
              value: 'Deployment'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'Mumm-ra'
            },
            headers: 'by'
          },
          {
            entity: {
              kind: 'list',
              value: [
                {
                  kind: 'link',
                  url: '/teams/0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca',
                  value: 'Forms'
                }
              ]
            },
            headers: 'team'
          },
          {
            entity: {
              kind: 'date',
              value: '2024-04-19T16:08:23.536Z',
              withSeconds: true
            },
            headers: 'started'
          }
        ]
      },
      {
        cells: [
          {
            classes: 'app-entity-table__cell--owned',
            entity: {
              kind: 'html',
              value: expect.stringContaining('Owned service')
            },
            headers: 'owner',
            isCentered: true
          },
          {
            headers: 'description',
            html: expect.stringContaining('cdp-user-service-backend')
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-user-service-backend/releases/tag/0.83.0',
              value: '0.83.0'
            },
            headers: 'version'
          },
          {
            entity: {
              classes: 'govuk-tag--light-blue',
              kind: 'tag',
              value: 'Stopped'
            },
            headers: 'status'
          },
          {
            entity: {
              classes: 'govuk-tag--blue',
              kind: 'tag',
              value: 'Deployment'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'B. A. Baracus'
            },
            headers: 'by'
          },
          {
            entity: {
              kind: 'list',
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
              value: '2024-04-10T13:12:38.878Z',
              withSeconds: true
            },
            headers: 'started'
          }
        ]
      }
    ])
  })
})

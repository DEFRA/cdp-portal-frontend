import { decorateRollouts } from './decorate-rollouts.js'
import { deploymentToEntityRow } from './deployment-to-entity-row.js'
import { deploymentsWithMigrationsFixture } from '../../../__fixtures__/deployments/deployments-with-migrations.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'

describe('#deploymentToEntityRow', () => {
  const adminGroupId = 'team:aabe63e7-87ef-4beb-a596-c810631fc474'
  const userScopes = [adminGroupId]
  const deploymentsDecorator = decorateRollouts({
    deployableServices: entityServicesFixture,
    userScopes
  })
  const deploymentsWithTeams = deploymentsDecorator(
    deploymentsWithMigrationsFixture.data
  )

  test('Should provide expected table rows', () => {
    expect(deploymentsWithTeams.map(deploymentToEntityRow)).toEqual([
      {
        by: 'Mumm-ra',
        isOwner: true,
        kind: 'deployment',
        kindClass: 'govuk-tag--blue',
        kindText: 'Deployment',
        service: 'cdp-example-node-postgres-be',
        started: '2025-04-30T14:48:34.001Z',
        statusClass: 'govuk-tag--green',
        statusText: 'Running',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        version: '0.356.0'
      },
      {
        by: 'B. A. Baracus',
        isOwner: true,
        kind: 'deployment',
        kindClass: 'govuk-tag--blue',
        kindText: 'Deployment',
        service: 'cdp-example-node-postgres-be',
        started: '2025-04-30T09:21:54.816Z',
        statusClass: 'govuk-tag--grey',
        statusText: 'Succeeded',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        version: '0.8.0'
      },
      {
        by: 'The Terminator',
        isOwner: true,
        kind: 'deployment',
        kindClass: 'govuk-tag--blue',
        kindText: 'Deployment',
        service: 'cdp-portal-frontend',
        started: '2024-08-28T10:39:55.31Z',
        statusClass: 'govuk-tag--green',
        statusText: 'Running',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        version: '0.356.0'
      },
      {
        by: 'Mumm-ra',
        isOwner: false,
        kind: 'deployment',
        kindClass: 'govuk-tag--blue',
        kindText: 'Deployment',
        service: 'forms-designer',
        started: '2024-04-19T16:08:23.536Z',
        statusClass: 'govuk-tag--light-blue',
        statusText: 'Stopped',
        teams: [
          {
            name: 'Forms',
            teamId: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca'
          }
        ],
        version: '0.73.0'
      },
      {
        by: 'B. A. Baracus',
        isOwner: true,
        kind: 'deployment',
        kindClass: 'govuk-tag--blue',
        kindText: 'Deployment',
        service: 'cdp-user-service-backend',
        started: '2024-04-10T13:12:38.878Z',
        statusClass: 'govuk-tag--light-blue',
        statusText: 'Stopped',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        version: '0.83.0'
      }
    ])
  })
})

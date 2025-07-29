import { decorateRollouts } from './decorate-rollouts.js'
import { deploymentsWithMigrationsFixture } from '../../../__fixtures__/deployments/deployments-with-migrations.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'

describe('#decorateRollouts', () => {
  test('Should decorate deployable with teams and owner information', () => {
    const mockUserScopeUUIDs = ['aabe63e7-87ef-4beb-a596-c810631fc474']
    const decorator = decorateRollouts({
      deployableServices: entityServicesFixture,
      userScopeUUIDs: mockUserScopeUUIDs
    })

    expect(decorator(deploymentsWithMigrationsFixture.data)).toEqual([
      expect.objectContaining({
        isOwner: true,
        kind: 'deployment',
        service: 'cdp-example-node-postgres-be',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      }),
      expect.objectContaining({
        isOwner: true,
        kind: 'migration',
        service: 'cdp-example-node-postgres-be',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      }),
      expect.objectContaining({
        isOwner: true,
        kind: 'deployment',
        service: 'cdp-portal-frontend',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      }),
      expect.objectContaining({
        isOwner: false,
        kind: 'deployment',
        teams: [
          {
            name: 'Forms',
            teamId: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca'
          }
        ]
      }),
      expect.objectContaining({
        isOwner: true,
        kind: 'deployment',
        service: 'cdp-user-service-backend',
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    ])
  })
})

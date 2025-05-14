import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { deploymentsWithMigrationsFixture } from '~/src/__fixtures__/deployments/deployments-with-migrations.js'

describe('#decorateDeployments', () => {
  test('Should decorate deployable with teams and owner information', () => {
    const mockUserScopeUUIDs = ['aabe63e7-87ef-4beb-a596-c810631fc474']
    const decorator = decorateDeployments({
      deployableServices: servicesFixture,
      userScopeUUIDs: mockUserScopeUUIDs
    })

    expect(decorator(deploymentsWithMigrationsFixture.data)).toEqual([
      expect.objectContaining({
        isOwner: true,
        kind: 'deployment',
        service: 'cdp-example-node-postgres-be',
        teams: [
          {
            github: 'cdp-platform',
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
            github: 'cdp-platform',
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
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          },
          {
            github: 'core-ai',
            name: null,
            teamId: null
          }
        ]
      }),
      expect.objectContaining({
        isOwner: false,
        kind: 'deployment',
        teams: [
          {
            github: 'forms',
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
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    ])
  })
})

import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { deploymentsFixture } from '~/src/__fixtures__/deployments.js'

describe('#decorateDeployments', () => {
  test('Should decorate deployable with teams and owner information', () => {
    const mockUserScopeUUIDs = ['aabe63e7-87ef-4beb-a596-c810631fc474']
    const decorator = decorateDeployments({
      deployableServices: servicesFixture,
      userScopeUUIDs: mockUserScopeUUIDs
    })

    expect(decorator(deploymentsFixture.data)).toEqual([
      expect.objectContaining({
        service: 'cdp-self-service-ops',
        isOwner: false,
        teams: []
      }),
      expect.objectContaining({
        service: 'cdp-user-service-backend',
        isOwner: true,
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      }),
      expect.objectContaining({
        service: 'cdp-portal-backend',
        isOwner: false,
        teams: [
          {
            name: 'team1',
            teamId: 'team1Id'
          },
          {
            name: 'team2',
            teamId: 'team2Id'
          }
        ]
      }),
      expect.objectContaining({
        service: 'cdp-portal-frontend',
        isOwner: true,
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
      })
    ])
  })
})

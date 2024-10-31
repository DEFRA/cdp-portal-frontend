import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { servicesFixture } from '~/src/__fixtures__/services.js'
import { deploymentsFixture } from '~/src/__fixtures__/deployments.js'

describe('#decorateDeployments', () => {
  test('Should decorate deployable with teams', () => {
    const decorator = decorateDeployments(servicesFixture)

    expect(decorator(deploymentsFixture?.data)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          teams: []
        }),
        expect.objectContaining({
          teams: [
            {
              github: 'cdp-platform',
              name: 'Platform',
              teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
            }
          ]
        }),
        expect.objectContaining({
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
          teams: [
            {
              github: 'cdp-platform',
              name: 'Platform',
              teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
            }
          ]
        })
      ])
    )
  })
})

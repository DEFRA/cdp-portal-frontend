import { sortBy } from '~/src/server/common/helpers/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt'))).toEqual([
      expect.objectContaining({
        service: 'cdp-portal-frontend',
        deployedAt: '2023-08-01T08:06:28Z'
      }),
      expect.objectContaining({
        service: 'cdp-self-service-ops',
        deployedAt: '2023-07-14T08:12:22Z'
      }),
      expect.objectContaining({
        service: 'cdp-teams-and-repositories',
        deployedAt: '2023-05-18T22:54:12Z'
      }),
      expect.objectContaining({
        service: 'cdp-teams-and-repositories',
        deployedAt: '2023-05-18T19:54:12Z'
      }),
      expect.objectContaining({
        service: 'cdp-teams-and-repositories',
        deployedAt: '2023-05-18T08:54:12Z'
      })
    ])
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt', 'desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          deployedAt: '2023-08-01T08:06:28Z'
        }),
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          deployedAt: '2023-07-14T08:12:22Z'
        }),
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T22:54:12Z'
        }),
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T19:54:12Z'
        }),
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T08:54:12Z'
        })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.sort(sortBy('deployedAt', 'asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T08:54:12Z'
        }),
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T19:54:12Z'
        }),
        expect.objectContaining({
          service: 'cdp-teams-and-repositories',
          deployedAt: '2023-05-18T22:54:12Z'
        }),
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          deployedAt: '2023-07-14T08:12:22Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          deployedAt: '2023-08-01T08:06:28Z'
        })
      ])
    )
  })
})

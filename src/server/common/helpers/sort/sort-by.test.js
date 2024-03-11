import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('#sortBy', () => {
  test('Should provide "desc" sorting by default', () => {
    expect(deploymentsFixture.data.sort(sortBy('created'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updated: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updated: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updated: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updated: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })

  test('Should provide "desc" sorting with "desc" argument', () => {
    expect(deploymentsFixture.data.sort(sortBy('created', 'desc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updated: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updated: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updated: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updated: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })

  test('Should provide "asc" sorting with "asc" argument', () => {
    expect(deploymentsFixture.data.sort(sortBy('created', 'asc'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: 'cdp-self-service-ops',
          updated: '2023-12-14T14:10:49Z'
        }),
        expect.objectContaining({
          service: 'cdp-user-service-backend',
          updated: '2023-12-14T14:10:34Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-backend',
          updated: '2023-12-14T14:58:13Z'
        }),
        expect.objectContaining({
          service: 'cdp-portal-frontend',
          updated: '2023-12-14T13:50:52Z'
        })
      ])
    )
  })
})
